var express = require('express');
var rainbow = require('../../');



var app = express();

app.use('/api', rainbow({
	controllers: 'controllers',
	glob: {
		ignore: [
			'ignore.me.js',
			'**.spec.js'
		]
	}
}));

var server;

exports.start = function () {
	server = app.listen.apply(app, arguments);
};

exports.stop = function (callback) {
	server.close(callback);
};
