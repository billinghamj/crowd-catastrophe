module.exports = {
	up: function (migration, DataTypes, done) {
		migration.createTable(
			'media',
			{
				id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
				instagramId: { type: DataTypes.STRING, allowNull: false, unique: true },
				date: { type: DataTypes.DATE, allowNull: true },
				thumbnailUrl: { type: DataTypes.STRING, allowNull: false },
				imageUrl: { type: DataTypes.STRING, allowNull: false },
				createdAt: { type: DataTypes.DATE },
				updatedAt: { type: DataTypes.DATE }
			},
			{ engine: 'InnoDB', charset: 'utf16' }
		);

		migration.createTable(
			'issues',
			{
				id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
				name: { type: DataTypes.STRING, allowNull: false, unique: true  },
				description: { type: DataTypes.STRING, allowNull: true },
				date: { type: DataTypes.DATE, allowNull: true },
				createdAt: { type: DataTypes.DATE },
				updatedAt: { type: DataTypes.DATE }
			},
			{ engine: 'InnoDB', charset: 'utf16' }
		);

		migration.createTable(
			'tags',
			{
				id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
				name: { type: DataTypes.STRING, allowNull: false, unique: true },
				createdAt: { type: DataTypes.DATE },
				updatedAt: { type: DataTypes.DATE }
			},
			{ engine: 'InnoDB', charset: 'utf16' }
		);

		done();
	},

	down: function (migration, DataTypes, done) {
		migration.dropAllTables();
		done();
	}
};
