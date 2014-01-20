//Install node.js: http://nodejs.org/
//Run: npm install
//Run: node server.js
var connect = require('connect');
connect.createServer(connect.static(__dirname)).listen(8080);