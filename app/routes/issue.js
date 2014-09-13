module.exports = setup;

function setup(app) {
	app.get('/issues', index);
	/*
	app.get('/issues/new', new);
	app.get('/issues/:id', show);
	app.get('/issues/:id/edit', edit);
	app.post('/issues', create);
	app.put('/issues/:id', update);
	*/
}

function index(req, res, next) {
	res.render('issue/index');
}
