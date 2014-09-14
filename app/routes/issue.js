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
		.error(next)
		.success(function (issue) {
			res.redirect(303, '/issues/' + issue.id);
		});
}

function createPage(req, res, next) {
	res.render('issue/create');
}

function show(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.error(function () {
			res.status(404).end();
		})
		.success(function (issue) {
			var sql =
				'SELECT *'
				+ ' FROM media m'
				+ ' JOIN tag_media tm ON tm.mediumId = m.id'
				+ ' JOIN issue_tags it ON it.tagId = tm.tagId'
				+ ' JOIN issues i ON i.id = it.issueId'
				+ ' WHERE i.id = ' + issue.id
				+ ' ORDER BY m.id DESC'
				+ ' LIMIT 100';

			req.app.get('models')
				._sequelize.query(sql, req.app.get('models').Media)
				.error(next)
				.success(function (media) {
					issue.media = media;
					res.render('issue/show', { issue: issue });
				});
		});
}

function update(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.error(function () {
			res.status(404).end();
		})
		.success(function (issue) {
			var tags = req.body.tags.split(/\s+/);

			issue.updateAttributes(req.body)
				.error(next)
				.success(function (issue) {
					var tagObjs = [];

					function success(tag) {
						tagObjs.push(tag);

						if (tagObjs.length !== tags.length)
							return;

						issue.setTags(tagObjs)
							.error(next)
							.success(function () {
								res.redirect(303, '/issues/' + issue.id);
							});
					}

					for (var i = 0; i < tags.length; i++) {
						req.app.get('models')
							.Tag.findOrCreate({ name: tags[i] })
							.error(next)
							.success(success);
					}
				});
		});
}

function destroy(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.success(function (issue) {
			issue.destroy()
				.error(next)
				.success(function () {
					res.redirect(303, '/issues/?success');
				});
		})
		.error(function () {
			res.status(404).end();
		});
}

function updatePage(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.error(function () {
			res.status(404).end();
		})
		.success(function (issue) {
			issue.getTags()
				.success(function (tags) {
					issue.tags = tags.map(function (t) { return t.name; }).join('\r\n');
					res.render('issue/update', { issue: issue });
				});
		});
}

function destroyPage(req, res, next) {
	req.app.get('models')
		.Issue.find({ where: { id: req.params.id } })
		.error(function () {
			res.status(404).end();
		})
		.success(function (issue) {
			res.render('issue/destroy', { issue: issue });
		});
}
