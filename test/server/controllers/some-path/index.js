exports.GET = function (req, res) {
	return res.status(200).send('some-path');
};

exports['GET /(\\d+)/'] = function (req, res) {
	return res.status(200).send(req.params[0]);
};
