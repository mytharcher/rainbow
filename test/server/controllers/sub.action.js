var subActions = {
	test: function (req, res) {
		res.status(200).send(req.query.parentId);
	}
};

exports['GET /(?:(\\d+)(?:/([_a-zA-Z.-]+))?)?/'] = function (req, res) {
	var id = req.params[0];
	if (id) {
		var subAction = subActions[req.params[1]];
		if (subAction) {
			req.query.parentId = id;
			return subAction.call(this, req, res);
		}

		return res.status(200).send(id);
	}

	res.status(200).send('ok');
};

// exports.GET.params = ':id?/:command?';
