var Sequelize = require('sequelize');

module.exports = setup;

function setup(sequelize) {
	var Issue = sequelize.define('issues', {
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		name: { type: Sequelize.STRING, allowNull: false, unique: true },
		description: { type: Sequelize.STRING, allowNull: true },
		date: { type: Sequelize.DATE, allowNull: true }
	});

	return Issue;
}
