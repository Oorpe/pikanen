# Pikanen

(Pikanen is finnish for ~quickie)

This is a very barebones Express server bootstrapper.

Similar to many quickstart servers, but with only one dependency and no extra bells or whistles.

Pikanen also generates a readable express index file, named `pikanen-index.js`, so it doubles as a simple express server generator.

* All loose (no leading dashes) keywords are treated as directory paths, relative to current location.

* Unknown dashed keywords raise errors.

## Installation

`pikanen` is a node executable, install globally with `npm install -g pikanen`.

## Usage

So, you have a new idea for a web feature that requires a server. Maybe a javascript framework is needed, so you have to serve the static app fragments/templates/whatever, and they all reside inside a www folder.

![](/docs/one-off-js.png)



Pikanen is a simple tool for not having to look up an express tutorial for the basic setup every time you need to just get a very basic server up.

In the above situation, invoking `pikanen www` will create a basic node express server file for the specified directory


![](/docs/express-required.png)

Oh no!
You will still need to install express in your project folder via `npm i express`, after which, invoking pikanen will yield the called for result:

![](/docs/serving-www.png)
![](/docs/success-angular.png)

Success! You are now serving the contents of the directory at `localhost:3000/www`, as well as having created a file `pikanen-index.js` in the folder where you invoked the command, which can be used as a basis for more complex routing logic without having to look up the same Express tutorial boilerplate for the 100th time.

![](/docs/pikanen-index.png)



## Other options:

### Basic usage:

`$ pikanen www` serves `/www` from current directory at `localhost:3000/www`


### Multiple directories:
*   `$ pikanen www libs` serves both `/www` and `/libs` from current directory under `localhost:3000/www` and `localhost:3000/libs`

### Port:
*   `$ pikanen -p 8001 www` serves `/www` from current directory at `localhost:8001/www`.

### aliases:
*   Aliasing allows you to set aliases for directories with unwieldy names or long relative paths, like UI components inside a node_modules directory
*   `$ pikanen /=node_modules/something/www` serves directory `/node_modules/something/www` at `localhost:3000/`.

### Root:

*   `$ pikanen -r/--root api/v1 libs=src` serves directory `/src` at `localhost:3000/api/v1/libs`. The root option changes the root of the whole server.

### Silent:
    '$ pikanen -s www' only creates the file without starting up a server
