module.exports = setup;

function setup(app) {
	app.get('/callbacks/instagram/ingester', verify);
	app.post('/callbacks/instagram/ingester', ingest);
}

function verify(req, res, next) {
	var inst = req.app.get('instagram');

	inst.subscriptions.handshake(req, res);
}

function ingest(req, res, next) {
	var inst = req.app.get('instagram');
	var changes = req.body;

	res.status(200).end();

	for (var i = 0; i < changes.length; i++) {
		var change = changes[i];

		console.log('notified of change to #' + change.object_id);

		inst.tags.recent({
			name: change.object_id,

			complete: function (images, pagination) {

				console.log('retrieved ' + images.length + ' images for #' + change.object_id);
				req.app.get('models').Tag
					.findOrCreate({ name: change.object_id })
						.success(function(tag, created) {
							for (var i = 0; i < images.length; i++) {
								var image = images[i];

								var thumb = image.images.thumbnail.url;
								var standard = image.images.standard_resolution.url;

								var object = {
									instagramId: image.id,
									date: new Date(image.created_time * 1000),
									thumbnailUrl: thumb,
									imageUrl: standard
								};

								req.app.get('models').Media.create(object)
									.success(function(media, created) {
										tag.addMedia(media).error(function (err) {
											console.log('error adding media to tag');
											console.log(err);
										});
									})
									.error(function (err) {
										console.log('error saving media');
										console.log(err);
									});
							}
						})
						.error(function (err) {
							console.log('error getting tags');
							console.log(err);
						});
			},

			error: function (errorMessage, errorObject, caller) {
				console.log('error getting media');
				console.log(errorMessage);
				console.log(errorObject);
			}
		});
	}
}
