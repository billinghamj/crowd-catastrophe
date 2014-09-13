module.exports = setup;

function setup(app) {
	app.get('/callbacks/instagram/ingester', verify);
	app.post('/callbacks/instagram/ingester', ingest);
}

function verify(req, res, next) {
	res.send(req.query['hub.challenge']);
}

function ingest(req, res, next) {
	console.log(req.body);
	res.status(200).end();
}
