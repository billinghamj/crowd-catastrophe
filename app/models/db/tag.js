var Sequelize = require('sequelize');

module.exports = setup;

function setup(sequelize) {
	var Tag = sequelize.define('tags', {
		name: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true }
	});

	return Tag;
}
