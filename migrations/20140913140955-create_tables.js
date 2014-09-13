module.exports = {
  up: function(migration, DataTypes, done) {
		migration.createTable(
		  'Media',
		  {
				id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
				instagramId: { type: DataTypes.STRING, allowNull: false, unique: true },
				date: { type: DataTypes.DATE, allowNull: true },
				thumbnailUrl: { type: DataTypes.STRING, allowNull: false },
				imageUrl: { type: DataTypes.STRING, allowNull: false },
				createdAt: {
		      type: DataTypes.DATE
		    },
		    updatedAt: {
		      type: DataTypes.DATE
		    },
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
				name: { type: DataTypes.STRING, allowNull: false, unique: true  },
				description: { type: DataTypes.STRING, allowNull: true },
				date: { type: DataTypes.DATE, allowNull: true },
				createdAt: {
		      type: DataTypes.DATE
		    },
		    updatedAt: {
		      type: DataTypes.DATE
		    },
		  },
		  {
		    engine: 'InnoDB', // default: 'InnoDB'
		    charset: 'latin1' // default: null
		  }
		)
		migration.createTable(
		  'Tag',
		  {
				name: { type: DataTypes.STRING, allowNull: false, primaryKey: true, unique: true },
				createdAt: {
		      type: DataTypes.DATE
		    },
		    updatedAt: {
		      type: DataTypes.DATE
		    },
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
