var fs = require('fs'),
		Issue = require('./issue'),
		Tag = require('./tag'),
		Picture = require('./image');
module.exports = setup;

function setup(sequelize) {
	return {
		Issue: Issue(sequelize), 
		Tag: Tag(sequelize), 
		Picture: Picture(sequelize)
	};
}
