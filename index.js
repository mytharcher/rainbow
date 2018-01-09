delete require.cache[__filename];

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

/**
 * Main function to initialize routers of a Express app.
 *
 * @param  {Object} paths (optional) For configure relative paths of
 *                        controllers rather than defaults.
 */
module.exports = function (options = {}) {
	var middleware = express.Router({
		strict: options.strict
	});
	var optionControllers = options.controllers || 'controllers';
	var ctrlDir = path.isAbsolute(optionControllers) ?
		optionControllers :
		path.join(path.dirname(module.parent.filename), optionControllers);
	var keyRE = new RegExp('(' + methods.join('|') + ')(?:\\s+((?:\\/(.+)\\/)|([^\\/].*[^\\/])))?', 'i');
	var globOptions = options.glob || {};

	glob.sync(ctrlDir + "/**/*.js", globOptions).forEach(function (file) {
		file = file.replace(/\.[^.]*$/, '');

		var instance = require(file);
		var url = file.replace(ctrlDir, '').replace(/\/index$/, '');

		Object.keys(instance).forEach(function (key) {
			if (key === 'filters') {
				return;
			}

			var matcher = key.match(keyRE);

			if (!matcher) {
				return console.warn('[rainbow]: Router key pattern "%s" is invalid.', key);
			}

			var method = matcher[1].toLowerCase();

			if (methods.indexOf(method) === -1 && method !== 'all') {
				return console.warn('[rainbow]: Unknown HTTP method "%s".', method);
			}

			if (typeof middleware[method] !== 'function') {
				return console.warn('[rainbow]: HTTP method "%s" is not supported.', method);
			}

			var router = instance[key];
			var filters = (instance.filters || []).concat(router.filters || []);
			var chain = filters.concat(router instanceof Array ? router : [router]);
			var params = router.params;
			if (matcher[2]) {
				if (matcher[3]) {
					params = new RegExp(matcher[3]);
				} else {
					params = matcher[4];
				}
			}
			var pathname = joinParam(url, params);

			middleware[method].apply(middleware, [pathname].concat(chain));
		});
	});

	return middleware;
};
