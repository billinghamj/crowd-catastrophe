var Sequelize = require('sequelize');

module.exports = setup;

function setup(sequelize) {
	return sequelize.define('tags', {
		name: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true }
	});
}
