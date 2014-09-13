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

	return models(sequelize);
}
