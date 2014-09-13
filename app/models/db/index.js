var fs = require('fs');
var Issue = require('./issue');
var Tag = require('./tag');
var Media = require('./media');

module.exports = setup;

function setup(sequelize) {
	return {
		Issue: Issue(sequelize),
		Tag: Tag(sequelize),
		Media: Media(sequelize),
		_sequelize: sequelize
	};
}
