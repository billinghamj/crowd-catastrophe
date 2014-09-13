var issue = require('./issue');

module.exports = setup;

function setup(app) {
	app.get('/', index);
	issue(app);
}

function index(req, res) {
	res.render('index');
}
