var Sequelize = require('sequelize');

module.exports = setup;

function setup(sequelize) {
	return sequelize.define('tags', {
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		name: { type: Sequelize.STRING, allowNull: false, unique: true },
	});
}
