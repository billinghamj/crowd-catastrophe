module.exports = setup;

function setup(app) {
	app.get('/', index);
}

function index(req, res) {
	res.render('index');
}
