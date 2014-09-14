module.exports = setup;

function setup(app) {
	setInterval(function () {
		var models = app.get('models');
		var sql = 'SELECT * FROM tags t JOIN issue_tags it ON it.tagId = t.name JOIN issues i ON it.issueId = i.id';

		models._sequelize.query(sql, models.Tag)
			.success(function (tags) {
				ingest(app, tags);
			});
	}, 30 * 1000);
}

function ingest(app, tags) {
	var inst = app.get('instagram');
	var models = app.get('models');

	for (var t = 0; t < tags.length; t++) {
		var tag = tags[t].name;

		inst.tags.recent({
			name: tag,

			error: function (errorMessage, errorObject, caller) {
				console.log('error getting media');
				console.log(errorMessage);
				console.log(errorObject);
			},

			complete: function (images, pagination) {
				console.log('retrieved ' + images.length + ' images for #' + tag);

				// string array of all required tags
				var tagsNeeded = [];
				for (var ti = 0; ti < images.length; ti++)
					tagsNeeded = tagsNeeded.concat(images[ti].tags);

				getTags(app, tagsNeeded, function (err, tags) {
					if (err) {
						console.log('error getting needed tags');
						console.log(err);
						return;
					}

					for (var i = 0; i < images.length; i++) {
						var image = images[i];

						var thumb = image.images.thumbnail.url;
						var standard = image.images.standard_resolution.url;

						var media = {
							instagramId: image.id,
							date: new Date(image.created_time * 1000),
							thumbnailUrl: thumb,
							imageUrl: standard
						};

						models.Media.create(media)
							.error(function (err) {
								if (err.code === 'ER_DUP_ENTRY')
									return;

								console.log('error creating media');
								console.log(err);
							})
							.success(function (media, created) {
								var mediaTags = [];
								for (var i = 0; i < image.tags.length; i++)
								 	mediaTags.push(tags[image.tags[i]]);

								media.setTags(mediaTags)
									.error(function (err) {
										console.log('error adding tags to media');
										console.log(err);
									});
							});
					}
				});
			}
		});
	}
}

function getTags(app, tags, callback) {
	var models = app.get('models');

	models.Tag.findAll()
		.error(callback)
		.success(function (existingTags) {
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
					tagMap = {};
					for (var i = 0; i < tags.length; i++)
						tagMap[tags[i].name] = tags[i];
					tags = tagMap;
					delete tagMap;

					callback(null, tagMap);
				});
		});
}
