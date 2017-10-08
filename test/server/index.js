var express = require('express');
var rainbow = require('../../');



var app = express();

app.use('/api', rainbow({
	controllers: 'controllers'
}));

var server;

exports.start = function () {
	server = app.listen.apply(app, arguments);
};

exports.stop = function (callback) {
	server.close(callback);
};
