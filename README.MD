# Pikanen

(Pikanen is finnish for ~quickie)

This is a very barebones Express server bootstrapper, installable as `npm i -g  pikanen`.

Similar to many quickstart servers, but with only one dependency and no extra bells or whistles.

## Usage

### basic usage:
*   `$ pikanen www` serves `www` from current directory at `localhost:3000/www`.

### Multiple directories:
*   `$ pikanen www libs` serves both `www` and `libs` from current directory under `localhost:3000/www` and `localhost:3000/libs`

### port:
*   `$ pikanen -p 8001 www` serves `www` from current directory at `localhost:8001/www`.

* aliases: `$ pikanen -a /=www libs=src files` serves directory www at `localhost:3000/` and directory src at `localhost:3000/libs`, and directory files at  `localhost:3000/files`

* all loose (no leading dashes) keywords are treated as directory paths, relative to current location.

* unknown keywords raise errors
