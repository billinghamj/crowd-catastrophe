var issue = require('./issue');
var callback = require('./callback');

module.exports = setup;

function setup(app) {
	app.get('/', index);
	issue(app);
	callback(app);
}

function index(req, res) {
	res.render('index');
}
