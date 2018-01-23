#!/usr/bin/env node
var fs = require('fs');
//minimist for basic arg parsing
var argv = require('minimist')(process.argv.slice(2));
// console.log(argv)
//all own helper functions here for testability
var utils = require("./src/utils.js")

var config = utils.grabConfigFromPackageJSON() || {};
// console.log(config);

//list known flags and keywords, all others are treated as errors and thrown
var known = [
    "r","root", //specify server root path
    "p","port", //specify the port to use
    "_", //unnamed array, paths
    "s","silent" //only generate express server file, don't run it
]

var nl = "\n";

//throw on bad arguments
utils.throwForUnknownKeys(argv, known);

//default port to 3000
var port = argv.port || argv.p || config.port || 3000;
//allow seting rootpath
var rootpath = argv.root || argv.r || config.root || "";
if(rootpath != ""){rootpath = utils.leadingSlash(rootpath);}
var paths = argv._; //grab paths from arguments
if(config.paths != undefined){
    paths = paths.concat(config.paths)
}

var silentOn = false;
var s = argv.silent || argv.s || config.silent;
// console.log(typeof(s))
if(s != "true" && s != "false" && s != true && s != false && s != undefined){
    console.log(s)
        paths.push(s);
        s = "true"; //set this for the next comparison
}
if(s == "true" || s == true){
    silentOn = true;
}
// console.log(paths)
//parse the path strings by = sign
var parsedpaths = paths.map(path => {
    return utils.checkForEquals(path)
})

fs.writeFile("pikanen-index.js", utils.templateExpress(parsedpaths, port, rootpath), function(){
    if(!silentOn){
        var cp = require('child_process');
        var n = cp.fork('./pikanen-index.js');
    }
});
