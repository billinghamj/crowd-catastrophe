var express = require('express');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var http = require('http');
var path = require('path');
var Instagram = require('instagram-node-lib');
var db = require('./db');

Instagram.set('client_id', process.env.INSTAGRAM_CLIENT_ID);
Instagram.set('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);

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
app.set('instagram', Instagram);
app.set('models', db(app));

console.log(process.env);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

module.exports = app;

/* istanbul ignore if : not used during unit testing */
if (require.main === module) {
	var server = http.createServer(app);
	var port = app.get('port');

	server.listen(port, function () {
		console.info('Express server listening on port ' + app.get('port'));
	});
}
