var defaultFilter = require('../filters/default');

exports.GET = function (req, res) {
	return res.status(200).send(res.locals.filterValue);
};

exports.POST = function (req, res) {
	return res.status(200).send(res.locals.filterValue);
};

exports.filters = [defaultFilter];
