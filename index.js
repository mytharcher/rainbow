var APP_ROOT = process.env.PWD;

var path = require('path');

var glob = require('glob');
var methods = require('methods');
var express = require('express');

function joinParam (url, param) {
	var ret = url;
	if (typeof param == 'string') {
		ret = path.join(url, param);
	} else if (param instanceof RegExp) {
		ret = new RegExp('^' + url.replace(/([\.\-])/g, '\\$1') + '/' +
			param.toString().replace(/^\/(\\\/)*|\/$/g, '') + '$');
	}
	return ret;
}

function route (url, method, instance) {
	var router = instance[method.toLowerCase()] || instance[method.toUpperCase()];

	if (router) {
		var filters = (instance.filters || []).concat(router.filters || []);
		var chain = filters.concat(router instanceof Array ? router : [router]);
		var m = method.toLowerCase();

		if (typeof this[m] != 'function') {
			console.error('[rainbow]: http method "' + method + '" is not supported.');
			return;
		}
		
		this[m].apply(this,
			[joinParam(url, router.params)].concat(chain)
		);
	}
}

/**
 * Main function to initialize routers of a Express app.
 * 
 * @param  {Object} paths (optional) For configure relative paths of
 *                        controllers and filters rather than defaults.
 */
module.exports = function (options = {}) {
	var router = express.Router();
	var ctrlDir = options.controllers || path.join(APP_ROOT, 'controllers');
	
	glob.sync(ctrlDir + "/**/*.js").forEach(function (file) {
		file = file.replace(/\.[^.]*$/, '');

		var instance = require(file);
		var single = typeof instance == 'function';
		var url = file.replace(ctrlDir, '').replace(/\/index$/, '/');
		
		single ? route.call(router, url, 'ALL', {ALL: instance}) :
			methods.forEach(function (method) {
				if (instance[method.toLowerCase()]) {
					console.warn('[rainbow]: Lower case HTTP methods are deprecated. Please change "' + method + '" in file:' + file + ' to upper case.');
				}
				route.call(router, url, method, instance);
			});
	});

	return router;
};
