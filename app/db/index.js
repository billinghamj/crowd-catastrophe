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

	modelsObject.Issue.hasMany(modelsObject.Tag, {through: 'issue_tags'});
	modelsObject.Media.hasMany(modelsObject.Tag, {through: 'tag_media'});
	modelsObject.Tag.hasMany(modelsObject.Media, {through: 'tag_media'});
	modelsObject.Tag.hasMany(modelsObject.Issue, {through: 'issue_tags'});

	sequelize.sync();
	return modelsObject;
}
