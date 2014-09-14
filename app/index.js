var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressHandlebars = require('express-handlebars');
var http = require('http');
var path = require('path');
var Instagram = require('instagram-node');
var db = require('./db');
var services = require('./services');

var instagram = Instagram.instagram();
instagram.use({
	client_id: process.env.INSTAGRAM_CLIENT_ID,
	client_secret: process.env.INSTAGRAM_CLIENT_SECRET
});

var routes = require('./routes');
var app = express();

app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main',
	layoutsDir: 'app/views/layouts/',
	partialsDir: 'app/views/partials/'
}));

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.set('databaseName', process.env.DATABASE_NAME);
app.set('databaseUsername', process.env.DATABASE_USERNAME);
app.set('databasePassword', process.env.DATABASE_PASSWORD);
app.set('databaseHost', process.env.DATABASE_HOST || '127.0.0.1');
app.set('databasePort', process.env.DATABASE_PORT || 3306);
app.set('instagram', instagram);
app.set('models', db(app));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride(function (req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

routes(app);

module.exports = app;
module.exports.services = services;

/* istanbul ignore if : not used during unit testing */
if (require.main === module) {
	var server = http.createServer(app);
	var port = app.get('port');

	server.listen(port, function () {
		console.info('Express server listening on port ' + app.get('port'));
	});

	services(app);
}
