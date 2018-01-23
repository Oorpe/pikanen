var fs = require('fs');
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
function parseStaticServes(parsedpaths){
    var staticServes = ""; //staticServes will contain the templated app.use... lines
    if(parsedpaths.length > 0){
        for(var path of parsedpaths){
         staticServes += "app.use('" + leadingSlash(path.alias) + "', express.static('" + path.dir + "'))" + "\n";
        }
    }
    return staticServes;
}

/**
    templated express file generation
*/
function templateExpress(parsedpaths, port, rootpath){

    var staticServes = parseStaticServes(parsedpaths);
    var dirs = parsedpaths.map(x => x.dir);
    var aliases = parsedpaths.map(x => { return  "\n" + "localhost:" + port + rootpath + leadingSlash(x.alias) })

    var res = `
    const express = require('express')
    const app = express()
    `+staticServes+`
    app.listen(`+port+", function(){console.log(`dirs ["+ dirs +"] served at " + aliases + "`)})"
    return res;
}

/**
    simply grab config variable from local package.json if available
*/
function grabConfigFromPackageJSON(){
    var pkg;
    try {
      let pkgFile = fs.readFileSync('package.json');
      pkg = JSON.parse(pkgFile);
    } catch(e) {
      console.log('No package.json found in current location!');
    }
    return pkg["pikanen"] || {};
}

module.exports = {
    leadingSlash: leadingSlash,
    checkForEquals: checkForEquals,
    throwForUnknownKeys: throwForUnknownKeys,
    templateExpress: templateExpress,
    grabConfigFromPackageJSON: grabConfigFromPackageJSON
}
