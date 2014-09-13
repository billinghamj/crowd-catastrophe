var Sequelize = require('sequelize');
var Media = require('./media');
var Issue = require('./media');

module.exports = setup;

function setup(sequelize) {
	var Tag = sequelize.define('tags', {
		name: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true }
	});

	if (typeof Media === 'function')
		Media = Media(sequelize);
	if (typeof Issue === 'function')
		Issue = Issue(sequelize);

	Tag.hasMany(Media, {through: 'tag_media'});
	Tag.hasMany(Issue, {through: 'issue_tags'});

	return Tag;
}
