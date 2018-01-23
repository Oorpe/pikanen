#!/usr/bin/env node
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
// console.dir(argv);

//unnamed contains the core path arguments
var paths = "";
if(argv._.length > 0){
    for(var path of argv._){
     paths += "app.use('/" + path + "', express.static('" + path + "'))" + "\n";
    }
}

var res = `
const express = require('express')
const app = express()
`+paths+`
app.listen(3000, function(){console.log('folder/s `+argv._+` is/are served at localhost:3000/`+argv._+`')})`;

fs.writeFile("quickit-index.js", res, function(){
    var cp = require('child_process');
    var n = cp.fork('./quickit-index.js');
});
