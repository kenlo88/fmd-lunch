var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var connection = require('./connection');
var routes = require('./routes');
var csv = require('csv-express');
var fs = require('fs');
var serveIndex = require('serve-index');
var morgan = require('morgan');

var app = express();
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(require('express-status-monitor')());
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '/../')));
app.use('/PFC', serveIndex(path.join(__dirname, '../../share/PFC'), {'icons': true, 'view': 'details'}));
app.use('/PFC', express.static(path.join(__dirname, '../../share/PFC')));
app.use('/CnDMMP', serveIndex('//ceddmedia/share/file/fmd/C&DMMPs', {'icons': true, 'view': 'details'}));
app.use('/CnDMMP', express.static('//ceddmedia/share/file/fmd/C&DMMPs'));
app.use(morgan('combined', {stream: accessLogStream}));

app.set('view engine', 'pug');
app.set('views', './views')

connection.init();
routes.configure(app);

var server = app.listen(80, function() {
  console.log('Server listening on port ' + server.address().port);
});