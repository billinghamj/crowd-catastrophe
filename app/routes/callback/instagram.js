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

		inst.tags.recent({
			name: change.object_id,

			complete: function (images, pagination) {
				var objects = [];

				for (var i = 0; i < images.length; i++) {
					var image = images[i];

					var thumb = image.images.thumbnail.url;
					var standard = image.images.standard_resolution.url;

					objects.push({
						instagramId: image.id,
						date: new Date(image.created_time * 1000),
						thumbnailUrl: thumb,
						imageUrl: standard
					});
				}

				Media.bulkCreate(objects)
					.success(function () {
						console.log('success');
					})
					.error(function (err) {
						console.log(err);
					});
			},

			error: function (errorMessage, errorObject, caller) {
				console.log('error!');
				console.log(errorMessage);
				console.log(errorObject);
				console.log(caller);
			}
		});
	}
}
