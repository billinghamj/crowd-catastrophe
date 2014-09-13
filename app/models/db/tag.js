var Sequelize = require('sequelize');
var Media = require('./media');

module.exports = setup;

function setup(sequelize) {
	var Tag = sequelize.define('tags', {
		name: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true }
	});

	if (typeof Media === 'function')
		Media = Media(sequelize);

	Tag.hasMany(Media);

	return Tag;
}
