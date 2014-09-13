var Sequelize = require('sequelize');
module.exports = setup;

function setup(sequelize) {
  var Picture = sequelize.define('Picture', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    igId: { type: Sequelize.STRING, allowNull: false },
    date: {type: Sequelize.DATE, allowNull: true}
  });
  return Picture;
}