var express = require('express'),
    wines = require('./routes/employee');
 
var app = express();

app.get('/employees2/:id/reports', wines.findByManager);
app.get('/employees2/:id', wines.findById);
app.get('/employees2', wines.findAll);
app.post('/employees2/:id/:firstName/:lastName/:managerId/post', wines.save);



app.listen(3000);
console.log('Listening on port 3000...');
