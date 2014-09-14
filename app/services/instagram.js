module.exports = setup;

function setup(app) {
	var models = app.get('models');
	var sql = 'SELECT * FROM tags t JOIN issue_tags it ON it.tagId = t.id JOIN issues i ON it.issueId = i.id';

	setInterval(function () {
		models._sequelize.query(sql, models.Tag)
			.success(function (tags) {
				ingest(app, tags);
			});
	}, 30 * 1000);
}

function ingest(app, tags) {
	console.log('ingesting for ' + tags.length + ' tags');

	getInstagramMedia(app, tags, function (err, media) {
		if (err) {
			console.log('error getting instagram media');
			console.log(err);
			return;
		}

		console.log('retrieved ' + media.length + ' media');

		importInstagramMedia(app, media, function (err, media) {
			if (err) {
				console.log('error importing media');
				console.log(err);
				return;
			}

			console.log('created ' + media.length + ' new media items');
		});
	});
}

function getInstagramMedia(app, tags, callback) {
	var inst = app.get('instagram');

	var results = [];
	var errors = [];
	var count = 0;

	for (var i = 0; i < tags.length; i++) {
		var j = i;

		setTimeout(function () {
			inst.tag_media_recent(tags[j].name,
				function (err, media, pagination, remaining, limit) {
					if (err)
						errors.push(err);
					else
						results.push(media);

					check();
				});
		}, 250 * j);
	}

	function check() {
		count++;

		if (count !== tags.length)
			return;

		if (errors.length) {
			var err = new Error('Failed to retrieve media');
			err.innerErrors = errors;
			callback(err);
			return;
		}

		var media = [];
		for (var i = 0; i < results.length; i++)
			media = media.concat(results[i]);

		callback(null, media);
	}
}

function importInstagramMedia(app, media, callback) {
	var tagsNeeded = [];
	for (var i = 0; i < media.length; i++)
		tagsNeeded = tagsNeeded.concat(media[i].tags);

	getTags(app, tagsNeeded, function (err, tags) {
		if (err) {
			callback(err);
			return;
		}

		var results = [];
		var errors = [];
		var count = 0;

		for (var i = 0; i < media.length; i++) {
			createMedium(app, tags, media[i], function (err, medium) {
				count++;

				if (err) {
					if (err.code !== 'ER_DUP_ENTRY')
						errors.push(err);
				} else {
					results.push(medium);
				}

				if (count === media.length) {
					if (errors.length) {
						var err = new Error('Failed to import media');
						err.innerErrors = errors;
						callback(err);
						return;
					}

					callback(null, results);
				}
			});
		}
	});
}

function getTags(app, tags, callback) {
	var models = app.get('models');

	models.Tag.findAll()
		.error(callback)
		.success(function (existingTags) {
			// remove non-ascii chars
			for (var i = 0; i < tags.length; i++)
				tags[i] = tags[i].replace(/[^\x00-\x7F]/g, '');

			// deduplicate
			tags = tags.filter(function (obj, pos, arr) {
				return arr.indexOf(obj) == pos;
			});

			// remove existing
			for (var i = 0; i < existingTags.length; i++) {
				var j = tags.indexOf(existingTags[i].name);
				if (j > -1) tags[j] = null;
			}

			var cleanedTags = [];
			for (var i = 0; i < tags.length; i++)
				if (tags[i])
					cleanedTags.push(tags[i]);
			tags = cleanedTags;
			delete cleanedTags;

			// create new tags
			tags = tags.map(function (t) { return { name: t }; });

			models.Tag.bulkCreate(tags)
				.error(callback)
				.success(function (newTags) {
					tags = existingTags.concat(newTags);

					// array<Tag> -> map<string, Tag>
					var tagMap = {};
					for (var i = 0; i < tags.length; i++)
						tagMap[tags[i].name] = tags[i];
					tags = tagMap;
					delete tagMap;

					callback(null, tags);
				});
		});
}

function createMedium(app, tags, medium, callback) {
	var models = app.get('models');

	var thumb = medium.images.thumbnail.url;
	var standard = medium.images.standard_resolution.url;

	var obj = {
		instagramId: medium.id,
		date: new Date(medium.created_time * 1000),
		thumbnailUrl: thumb,
		imageUrl: standard
	};

	models.Media.create(obj)
		.error(callback)
		.success(function (newMedium) {
			// remove non-ascii chars
			for (var i = 0; i < medium.tags.length; i++)
				medium.tags[i] = medium.tags[i].replace(/[^\x00-\x7F]/g, '');

			// deduplicate
			medium.tags = medium.tags.filter(function (obj, pos, arr) {
				return arr.indexOf(obj) == pos;
			});

			var mediumTags = [];
			for (var i = 0; i < medium.tags.length; i++)
			 	mediumTags.push(tags[medium.tags[i]]);

			newMedium.setTags(mediumTags)
				.error(callback)
				.success(function () {
					callback(null, newMedium);
				});
		});
}
