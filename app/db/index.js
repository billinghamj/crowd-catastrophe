var Sequelize = require('sequelize');
var models = require('../models/db');

module.exports = setup;

function setup(app) {
	console.log(app.get('databaseName'),
		app.get('databaseUsername'),
		app.get('databasePassword'));

	var sequelize = new Sequelize(
		app.get('databaseName'),
		app.get('databaseUsername'),
		app.get('databasePassword'));

	return models(sequelize);
}
