var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static(path.join(__dirname,'app/public')));

app.set('json spaces', 1);

var htmlRoutes = require('./app/routing/htmlRoutes.js')(app, path);
var apiRoutes = require('./app/routing/apiRoutes.js')(app, path);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}.`);
});