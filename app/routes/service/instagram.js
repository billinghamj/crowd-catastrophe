module.exports = setup;

function setup(app) {
	setInterval(function () {
		ingest(app);
	}, 60 * 1000);
}

function ingest(app) {
	var models = app.get('models');
	models.Issue.findAll().success(function (issues) {
		for (var i = 0; i < issues.length; i++) {
			var issue = issues[i];
			issue.getTags.success(function (tags) {
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
							console.log('retrieved ' + images.length + ' images for #' + tag + ' for issue ' + issue.name);

							// string array of all required tags
							var tagsNeeded = [];
							for (var ti = 0; ti < images.length; ti++)
								tagsNeeded = tagsNeeded.concat(images[ti].tags);

							// deduplicate
							tagsNeeded = tagsNeeded.filter(function (obj, pos, arr) {
								return arr.indexOf(obj) == pos;
							});
							for (var ti = 0; ti < tags.length; ti++) {
								var j = tagsNeeded.indexOf(tags[ti].name);
								if (j > -1) tagsNeeded[j] = null;
							}

							// remove null entries
							var cleanedTags = [];
							for (var ti = 0; ti < tagsNeeded.length; ti++)
								if (tagsNeeded[ti])
									cleanedTags.push(tagsNeeded[ti]);
							tagsNeeded = cleanedTags;
							delete cleanedTags;

							// create new tags
							for (var ti = 0; ti < tagsNeeded.length; ti++)
								tagsNeeded[ti] = { name: tagsNeeded[ti] };

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
						}
					});
				}
			});
		}
	});
}
