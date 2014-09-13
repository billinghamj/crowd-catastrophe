var Sequelize = require('sequelize');
var Tag = require('./tag');

module.exports = setup;

function setup(sequelize) {
	var Issue = sequelize.define('Issue', {
		id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
		name: { type: Sequelize.STRING, allowNull: false },
		description: { type: Sequelize.STRING, allowNull: true },
		date: { type: Sequelize.DATE, allowNull: true }
	});

	if (typeof Tag === 'function')
		Tag = Tag(sequelize);

	Issue.hasMany(Tag);

	return Issue;
}
