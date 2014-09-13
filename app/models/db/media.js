var Sequelize = require('sequelize');

module.exports = setup;

function setup(sequelize) {
	var Media = sequelize.define('media', {
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		instagramId: { type: Sequelize.STRING, allowNull: false, unique: true },
		date: { type: Sequelize.DATE, allowNull: true },
		thumbnailUrl: { type: Sequelize.STRING, allowNull: false },
		imageUrl: { type: Sequelize.STRING, allowNull: false }
	});

	return Media;
}
