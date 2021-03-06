module.exports = setup;

function setup(app) {
	app.get('/callbacks/instagram/ingester', verify);
	app.post('/callbacks/instagram/ingester', ingest);
}

function verify(req, res, next) {
	res.send(req.query['hub.challenge']);
}

var cooloff = false;

function ingest(req, res, next) {
	if (cooloff) {
		res.status(200).end();
		return;
	}

	//cooloff = true;

	setTimeout(function () {
		cooloff = false;
	}, 15 * 1000);

	var inst = req.app.get('instagram');
	var changes = req.body;

	res.status(200).end();

	for (var i = 0; i < changes.length; i++) {
		var change = changes[i];

		console.log('notified of change to #' + change.object_id);

		inst.tag_media_recent(change.object_id,
			function (err, images, pagination, remaining, limit) {
				if (err) {
					console.log('error getting media');
					console.log(err);
					return;
				}

				console.log('retrieved ' + images.length + ' images for #' + change.object_id);

				// string array of all required tags
				var tagsNeeded = [];
				for (var i = 0; i < images.length; i++)
					tagsNeeded = tagsNeeded.concat(images[i].tags);

				// deduplicate
				tagsNeeded = tagsNeeded.filter(function (obj, pos, arr) {
					return arr.indexOf(obj) == pos;
				});

				var models = req.app.get('models');

				models.Tag.findAll().success(function (tags) {
					// remove tags we already have
					for (var i = 0; i < tags.length; i++) {
						var j = tagsNeeded.indexOf(tags[i].name);
						if (j !== -1) tagsNeeded[j] = null;
					}

					// remove null entries
					var cleanedTags = [];
					for (var i = 0; i < tagsNeeded.length; i++)
						if (tagsNeeded[i])
							cleanedTags.push(tagsNeeded[i]);
					tagsNeeded = cleanedTags;
					delete cleanedTags;

					// create new tags
					for (var i = 0; i < tagsNeeded.length; i++)
						tagsNeeded[i] = { name: tagsNeeded[i] };

					models.Tag.bulkCreate(tagsNeeded)
						.error(function (err) {
							console.log('error creating new tags');
							console.log(err);
						})
						.success(function (createdTags) {
							tags = tags.concat(createdTags);

							// array<Tag> -> map<string, Tag>
							tagMap = {};
							for (var i = 0; i < tags.length; i++)
								tagMap[tags[i].name] = tags[i];
							tags = tagMap;
							delete tagMap;

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
				});
			});
	}
}
