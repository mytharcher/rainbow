exports.GET = function (req, res) {
	res.status(204).end();
};

exports['GET /(\\d+)/'] = function (req, res) {
	res.status(200).send(req.params[0]);
};

exports['GET :id/comments'] = function (req, res) {
	res.status(200).send(req.params.id);
};
