module.exports = setup;

function setup(app) {
	app.get('/issues', index);
	app.post('/issues', create);
	app.get('/issues/new', createPage);
	app.get('/issues/:id', show);
	app.put('/issues/:id', update);
	app.delete('/issues/:id', destroy);
	app.get('/issues/:id/edit', updatePage);
	app.get('/issues/:id/delete', destroyPage);
}

function index(req, res, next) {
	req.app.get('models')
		.Issue.findAll()
		.success(function (issues) {
			res.render('issue/index', { issues: issues });
		});
}

function create(req, res, next) {
	req.app.get('models')
		.Issue.create(req.body)
		.success(function (issue) {
			res.redirect(303, '/issues/' + issue.id);
		})
		.error(function (error) {
			next(error);
		});
}

function createPage(req, res, next) {
	res.render('issue/create');
}

function show(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.success(function (issue) {
			res.render('issue/show', { issue: issue });
		})
		.error(function () {
			res.status(404).end();
		});
}

function update(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.success(function (issue) {
			issue.updateAttributes(req.body)
				.success(function (issue) {
					res.redirect(303, '/issues/' + issue.id);
				})
				.error(function () {
					res.redirect(303, '/issues/' + issue.id + '/edit?failure');
				});
		})
		.error(function () {
			res.status(404).end();
		});
}

function destroy(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.success(function (issue) {
			issue.destroy()
				.success(function () {
					res.redirect(303, '/issues/?success');
				})
				.error(function () {
					res.status(500).end();
				});
		})
		.error(function () {
			res.status(404).end();
		});
}

function updatePage(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.success(function (issue) {
			res.render('issue/update', { issue: issue });
		})
		.error(function () {
			res.status(404).end();
		});
}

function destroyPage(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.success(function (issue) {
			res.render('issue/destroy', { issue: issue });
		})
		.error(function () {
			res.status(404).end();
		});
}
