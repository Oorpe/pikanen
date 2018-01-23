module.exports = {
     known : [
        "r","root", //specify server root path
        "p","port", //specify the port to use
        "_", //unnamed array, paths
        "s","silent" //only generate express server file, don't run it
    ],
    general:{
        example:"pikanen [keyword-value pairs / routes / route=alias pairs], no specific order"
        ,explanation: "specify any number of routes, separated by whitespace. Routes can be aliased eg. /=www will serve www at the server's public root"
    }
    ,root:{
        example:"pikanen [relative path to directory] -r [root path, eg. api/v1]"
        ,explanation: "-r/--root will allow you to specify a root path that applies to all served dirs"
    }
    ,port:{
        example:"pikanen [relative path to directory] "
    }
    ,silent:{
        example:"pikanen [relative path to directory] -s"
        ,
    }
}
