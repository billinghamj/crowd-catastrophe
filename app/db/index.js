var Sequelize = require('sequelize');
var models = require('../models/db');

module.exports = setup;

function setup(app) {
	var sequelize = new Sequelize(
		app.get('databaseName'),
		app.get('databaseUsername'),
		app.get('databasePassword'),
		{
			host: app.get('databaseHost'),
			port: app.get('databasePort'),
			logging: true
		});

	var m = models(sequelize);

	m.Issue.hasMany(m.Tag, { through: 'issue_tags' });
	m.Media.hasMany(m.Tag, { through: 'tag_media' });
	m.Tag.hasMany(m.Media, { through: 'tag_media' });
	m.Tag.hasMany(m.Issue, { through: 'issue_tags' });

	sequelize.sync();

	return m;
}
