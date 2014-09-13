var Sequelize = require('sequelize');
var models = require('../models/db');

module.exports = setup;

function setup(app) {
	console.log(app.get('databaseName'),
		app.get('databaseUsername'),
		app.get('databasePassword'));

	var sequelize = new Sequelize('mysql://'+app.get('databaseUsername')+':'+app.get('databasePassword')+'@127.0.0.1:3306/'+app.get('databaseName'), {});
  console.log(sequelize)
	return models(sequelize);
}
