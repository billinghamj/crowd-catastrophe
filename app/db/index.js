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
			port: app.get('databasePort')
		});

	var modelsObject = models(sequelize);

	modelsObject.Issue.hasMany(Tag, {through: 'issue_tags'});
	modelsObject.Media.hasMany(Tag, {through: 'tag_media'});
	modelsObject.Tag.hasMany(Media, {through: 'tag_media'});
	modelsObject.Tag.hasMany(Issue, {through: 'issue_tags'});

	sequelize.sync();
	return modelsObject;
}
