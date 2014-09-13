var Sequelize = require('sequelize');

module.exports = setup;

function setup(sequelize) {
	var Media = sequelize.define('Media', {
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		instagramId: { type: Sequelize.STRING, allowNull: false },
		date: { type: Sequelize.DATE, allowNull: true }
	});

	return Media;
}
