#!/usr/bin/env node
var fs = require('fs');
var chalk = require("chalk");
//minimist for basic arg parsing
var argv = require('minimist')(process.argv.slice(2));
// console.log(argv)
//all own helper functions here for testability
var utils = require("./src/utils.js")

var config = utils.grabConfigFromPackageJSON({defaultConfig: {
    root: "",
    port: 3000,
    silent: false,
    paths: []
}});
// console.log(config);

//list known flags and keywords, all others are treated as errors and thrown
var known = [
    "r","root", //specify server root path
    "p","port", //specify the port to use
    "_", //unnamed array, paths
    "s","silent" //only generate express server file, don't run it
]

// var nl = "\n";

//throw on bad arguments
utils.throwForUnknownKeys(argv, known);



var config = utils.resolveCmdArgs(argv, config);
// console.log("resolved config:\n",config)

fs.writeFile("pikanen-index.js", utils.templateExpress(config.paths, config.port, config.root), function(){
    console.log(chalk.magentaBright.dim("express server file generated") + " => " + chalk.cyanBright.dim("pikanen-index.js"))
    if(utils.isFalsy(config.silent) && config.paths.length > 0){
        var cp = require('child_process');
        var n = cp.fork('./pikanen-index.js');
    }
});
