module.exports = setup;

function setup(app) {
	app.get('/callbacks/instagram/ingester', verify);
	app.post('/callbacks/instagram/ingester', ingest);
}

function verify(req, res, next) {
	var inst = req.app.get('instagram');

	inst.subscriptions.handshake(request, response);
}

function ingest(req, res, next) {
	res.status(200).end();

	var changes = req.body;

	for (var i = 0; i < changes.length; i++) {
		var change = changes[i];

		Instagram.tags.recent({
			name: change.object_id,

			complete: function (data, pagination) {
				console.log(data);
				console.log('#' + change.object_id + ': ');
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
