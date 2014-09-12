var express = require('express');
var exphbs = require('express-handlebars');
var http = require('http');
var path = require('path');

var routes = require('./routes');
var app = express();

app.engine('handlebars', exphbs({
	defaultLayout: 'main',
	layoutsDir: 'app/views/layouts/',
	partialsDir: 'app/views/partials/'
}));

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

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
