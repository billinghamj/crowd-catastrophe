module.exports = {
  up: function(migration, DataTypes, done) {
		migration.createTable(
		  'Media',
		  {
				id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
				instagramId: { type: DataTypes.STRING, allowNull: false },
				date: { type: DataTypes.DATE, allowNull: true },
				thumbnailUrl: { type: DataTypes.STRING, allowNull: false },
				imageUrl: { type: DataTypes.STRING, allowNull: false }
		  },
		  {
		    engine: 'InnoDB', // default: 'InnoDB'
		    charset: 'latin1' // default: null
		  }
		)
		migration.createTable(
		  'Issue',
		  {
				id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
				name: { type: DataTypes.STRING, allowNull: false },
				description: { type: DataTypes.STRING, allowNull: true },
				date: { type: DataTypes.DATE, allowNull: true }
		  },
		  {
		    engine: 'InnoDB', // default: 'InnoDB'
		    charset: 'latin1' // default: null
		  }
		)
		migration.createTable(
		  'Tag',
		  {
				name: { type: DataTypes.STRING, allowNull: false, primaryKey: true }
			},
		  {
		    engine: 'InnoDB', // default: 'InnoDB'
		    charset: 'latin1' // default: null
		  }
		)
    done()
  },
  down: function(migration, DataTypes, done) {
		migration.dropAllTables()
    done()
  }
}
