#!/usr/bin/env node
var fs = require('fs');
//minimist for basic arg parsing
var argv = require('minimist')(process.argv.slice(2));
// console.dir(argv);
//list known flags and keywords, all others are treated as errors and thrown
var known = [
    "a",
    "alias",
    "p",
    "port",
    "_"
]

var keys = Object.keys(argv);

keys.forEach((key)=>{
    if(!known.includes(key)){
        var str = "weird flag detected: -" + key + ", are you sure you put two dashes for '--alias'?";
        throw(str)
    }
})

//default to 3000
var port = argv.port || argv.p || 3000;

var paths = [];

//on a or alias all filenames are to be interpreted as aliasable, check for = signs
if(argv.a || argv.alias){
    paths.push(argv.alias || argv.a);
    paths = paths.concat(argv._);
}

var parsedpaths = paths.map(path => {
    // console.log(path)
    return checkForEquals(path)
    // console.log(path)
    // return path;
})

console.log(parsedpaths)
//unnamed contains the core path arguments
var staticServes = "";

if(parsedpaths.length > 0){
    for(var path of parsedpaths){
     staticServes += "app.use('" + leadingSlash(path.alias) + "', express.static('" + path.dir + "'))" + "\n";
    }
}
console.log(staticServes)
// //
var dirs = parsedpaths.map(x => x.dir);
var aliases = parsedpaths.map(x => {
    return "localhost:" + port + leadingSlash(x.alias)
})
console.log(aliases)
var res = `
const express = require('express')
const app = express()
`+staticServes+`
app.listen(`+port+`, function(){console.log('dirs [`+ dirs +`] served at `+aliases+`')})`;

fs.writeFile("pikanen-index.js", res, function(){
    var cp = require('child_process');
    var n = cp.fork('./pikanen-index.js');
});

/**
    check for equals signs, split to dir and alias strings
*/
function checkForEquals(str){
    // console.log("hei")
    var i = str.indexOf("=");
    var res;
    if(i != -1){
        res = {dir: str.slice(i+1), alias: str.slice(0, i)}
    }else{
        //no = sign
        res = {dir: str, alias: str}
    }
    // console.log(res);
    return res;
}

/**
    add leading slashes when necessary
*/
function leadingSlash(str){
    if(str[0] == "/"){
        return str;
    }else{
        return "/"+str;
    }
}
