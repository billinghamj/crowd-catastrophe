var Sequelize = require('sequelize'),
    Picture = require('./image');
module.exports = setup;

function setup(sequelize) {
  var Tag = sequelize.define('Tag', {
    name: {type: Sequelize.STRING, allowNull: false, primaryKey: true}
  });
  if (typeof(Picture) == "function") {
  	Picture = Picture(sequelize);
  }
  Tag.hasMany(Picture);
  return Tag;
}