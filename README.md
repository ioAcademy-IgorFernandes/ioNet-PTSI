# netin_api for IOTECH
- netin_api documentation: https://documenter.getpostman.com/view/1797095/S1TSaKrX
```
```
## API Structure for IOTECH
<p  align="center">
<img  src="https://img.shields.io/badge/status-in%20development-orange.svg"  alt="Development Status">
<img  src="https://img.shields.io/badge/npm-v6.4.1-blue.svg"  alt="NPM Version">
<img  src="https://img.shields.io/badge/node.js-v8.12.0-green.svg"  alt="Node.js Version">
  
Requirements:
- **ECMAScript 8** or superior

## Project setup
```
git clone git@github.com:iotechpis/api_structure.git
cd api_structure
npm install
```
  
## Create App/Module

### Create a new app (in /server/Apps)
```
npm run createA
```

### Create a new module (in /server/Modules)
```
npm run createM
```

## Variable Declaration

### Functions ( lowerCamelCase )
```
let updateUserById = () => {}
```

### Models ( UpperCamelCase )
```
const User = require("./UserModel");
```

### Arrays ( snake_case )
Arrays are an iterable list of items, usually of the same type. Since they will hold multiple values, **pluralizing** the variable name makes sense.
```
const fruits = ['apple', 'banana', 'cucumber'];
```

### Booleans ( lowerCamelCase )
Booleans can hold only 2 values, `true` or `false`. Given this, using prefixes like “**is**”, “**has**”, and “**can**” will help the reader infer the type of the variable.
```
const isOpen = true;
const canWrite = true;
```

### Config/Messages ( UPPERCASE )
```
const CONFIG = require("./ioExampleConfig");
const MESSAGES = require("./UserMessages");
```

### Other variables ( snake_case )
```
let user_name = "John";
let zip_code = "1111-222";
```

## File Naming
All files must be named in `UpperCamelCase`, starting with the module name followed by the file name (Controller, Model, Route, etc). Check `./api_structure/server/Apps/ioExample` for an example.
