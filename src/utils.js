var fs = require('fs');
var chalk = require('chalk');
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
    // console.log(str)
    if(str[0] == "/"){
        return str;
    }else{
        return "/"+str;
    }
}

/**
    argv: argument vector
    knownKeys: array of known keys, others trigger errors
*/
function throwForUnknownKeys(argv, knownKeys){
    var keys = Object.keys(argv);
    keys.forEach((key)=>{
        if(!knownKeys.includes(key)){
            var str = "weird flag detected: -" + key ;
            throw(str)
        }
    })
}

/**
    parse the static serve paths into templated strings
*/
function parseStaticServes(parsedpaths, rootpath){
    var staticServes = ""; //staticServes will contain the templated app.use... lines
    if(parsedpaths.length > 0){
        for(var path of parsedpaths){
         staticServes += "app.use('" + rootpath + leadingSlash(path.alias) + "', express.static('" + path.dir + "'))" + "\n";
        }
    }
    return staticServes;
}

/**
    templated express file generation
*/
function templateExpress(parsedpaths, port, rootpath){

    var staticServes = parseStaticServes(parsedpaths, rootpath);
    var dirs = parsedpaths.map(x => x.dir);
    var aliases = parsedpaths.map(x => { return  "\n" + "localhost:" + port + rootpath + leadingSlash(x.alias) })

    var res = `
    const express = require('express');
    var chalk = require('chalk');
    const app = express();
    `+staticServes+`
    app.listen(`+port+", function(){console.log(`dirs ["+ dirs +"] served at " + aliases + "`)});"
    return res;
}

function updatedTemplateExpress(parsedpaths, port, rootpath){

    var staticServes = parseStaticServes(parsedpaths, rootpath);

    // var dirs = parsedpaths.map(x => x.dir);
    // var aliases = parsedpaths.map(x => { return  "\n" + "localhost:" + port + rootpath + leadingSlash(x.alias) })
    var lines = parsedpaths.map(x => { return "\n" + chalk.magentaBright.dim(x.dir)
    + " => "
    + chalk.cyanBright.dim.underline("http://localhost:" + port + rootpath + leadingSlash(x.alias)) + " "})

    var res = `const express = require('express')
    const app = express()
    `+staticServes+`
    app.listen(`+port+", function(){console.log(`"
    + lines +
    "`)})"
    return res;
}

/**
    simply grab config variable from local package.json if available,
    otherwise use the provided default
*/
function grabConfigFromPackageJSON(param){
    var pkg;
    var res;
    try {
      let pkgFile = fs.readFileSync('package.json');
      pkg = JSON.parse(pkgFile);
    } catch(e) {
      console.log(chalk.yellow.dim.inverse("no package.json pikanen entry") + " => " + chalk.cyanBright.dim("using default config: "));
    }
    if(pkg && pkg.pikanen){
        res = pkg.pikanen;
    }
    else {
        res = param.defaultConfig;
        console.log(chalk.yellow.dim.inverse("no package.json pikanen entry") + " => " + chalk.cyanBright.dim("using default config: \n"), res);

    }
    return res;
}

/**
    slot determines which property is in question, arr contains the config objects in order of importance
*/
// function resolveConfigOptions(stored, cmdargs){
//     var res = stored;
//     for(var x in cmdargs){
//
//     }
// }

//resolve argv
function resolveArgvOption(argv, slotaliases, def){
    var res;
    slotaliases.forEach(alias => {
        if(argv[alias]){
            // console.log("argv[",alias,"]=",argv[alias])
            res = argv[alias];
        }
    })
    return res || def;
}

function removeDuplicates(arr){
    var once = [];
    arr.map(x => {
        if(x && !once.includes(x)){
            once.push(x);
        }
    })
    return once;
}

function resolveCmdArgs(argv, storedConfig){
    var res = {};
    //grab paths from config and arguments
    res.paths = argv._;
    //resolve between stored config and argv
    res.silent = resolveArgvOption(argv, ["s", "silent"], storedConfig.silent)
    res.port = resolveArgvOption(argv, ["p", "port"], storedConfig.port)
    res.root = resolveArgvOption(argv, ["r", "root"], storedConfig.root)

    //handle edge cases
    //if silent flag is used without specification, it might "eat" one of the paths
    if(![true, false, "true", "false"].includes(res.silent)){
        res.paths.push(res.silent)
    }
    //if root is specified, add leading slash on need
    if(res.root && res.root != ""){
        res.root = leadingSlash(res.root)
    }
    else{
        res.root = "";
    }

    // grab stored paths as well
    if(storedConfig.paths != undefined){
        res.paths = res.paths.concat(storedConfig.paths)
    }
    res.paths = removeDuplicates(res.paths);
    //map paths through the = sign checker
    // console.log(res.paths)
    res.paths = res.paths.map(path => {
        // console.log(path)
        return checkForEquals(path)
    })
    return res;
}

function isFalsy(val){
    return [false, "false"].includes(val);
}

module.exports = {
    isFalsy: isFalsy,
    leadingSlash: leadingSlash,
    checkForEquals: checkForEquals,
    throwForUnknownKeys: throwForUnknownKeys,
    templateExpress: updatedTemplateExpress,
    grabConfigFromPackageJSON: grabConfigFromPackageJSON,
    resolveCmdArgs: resolveCmdArgs
    // resolveConfigOptions: resolveConfigOptions
}
