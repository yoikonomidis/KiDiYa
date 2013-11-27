var http = require("http");
var url = require("url");
var express = require("express");
var employees = require("./employee");

var app = express();

function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    route(pathname);

//    response.writeHead(200, {"Content-Type": "text/plain"});
//    response.write("Hello World");
    response.sendfile('./views/test1.html');
//    response.end();
  }

  app.get('/', onRequest);
  app.get('/employees/:id/reports', employees.findByManager);
  app.get('/employees/:id', employees.findById);
  app.get('/employees', employees.findAll);
  app.post('/employees/:id/:firstName/:lastName/:managerId/post', employees.save);
  
  app.listen(8888);
  //http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;