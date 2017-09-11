exports.GET = function (req, res) {
	res.status(200).send(req.query.parentId);
};