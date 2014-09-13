var Sequelize = require('sequelize'),
		models = require('../models/db');

module.exports = setup;

function setup(app) {
	var sequelize = new Sequelize(app.get('databaseName'), app.get('databaseUsername'), app.get('databasePassword'));
	return models(sequelize);
}
