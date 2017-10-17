var express = require('express');
var rainbow = require('../../');
var path = require('path');


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

app.use('/api/abs', rainbow({
  controllers: path.join(__dirname, 'controllers'),
}));

var server;

exports.start = function () {
	server = app.listen.apply(app, arguments);
};

exports.stop = function (callback) {
	server.close(callback);
};
