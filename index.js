var approot = process.env.PWD;

var path = require('path');

var glob = require('glob');
var methods = require('methods');

function joinParam (url, param) {
	var ret = url;
	if (typeof param == 'string') {
		ret = path.join(url, param);
	} else if (param instanceof RegExp) {
		ret = new RegExp('^' + url.replace(/([\.\-])/g, '\\$1') + '/' +
			param.toString().replace(/^\/(\\\/)*|\/$/g, '') + '$');
	}
	console.log(ret);
	return ret;
}

/**
 * Main function to initialize routers of a Express app.
 * 
 * @param  {Express} app  Express app instance
 * @param  {Object} paths (optional) For configure relative paths of
 *                        controllers and filters rather than defaults.
 */
exports.route = function (app, paths) {
	function route (url, method, instance) {
		var router = instance[method.toLowerCase()] || instance[method.toUpperCase()];

		if (router) {
			var filters = (instance[filters] || []).concat(router.filters || []).map(function (item) {
				switch (typeof item) {
					case 'function':
						return item;

					case 'string':
						return require(path.join(fltrDir, item));

					default:
						console.error('[rainbow]: Filter only support function or string of path.');
						return null;
				}
			}).filter(function (item) {
				return !!item;
			});
			
			app[method.toLowerCase()].apply(app, [joinParam(url, router.params)]
				.concat(filters)
				.concat([router])
			);
		}
	}
	
	paths = paths || {};
	var ctrlDir = path.join(approot, (paths.controllers || 'controllers'));
	var fltrDir = path.join(approot, (paths.filters || 'filters'));
	
	glob.sync(ctrlDir + "/**/*.+(coffee|js)").forEach(function (file) {
		file = file.replace(/\.[^.]*$/, '');
		var instance = require(file);
		var single = typeof instance == 'function';
		var url = file.replace(ctrlDir, '').replace(/\/index$/, '/');
		
		single ? route(url, 'ALL', {ALL: instance}) :
			methods.forEach(function (method) {
				if (instance[method.toLowerCase()]) {
					console.warn('[rainbow]: Lower case HTTP methods are deprecated. Please change "' + method + '" in file:' + file + ' to upper case.');
				}
				route(url, method, instance);
			});
	});
};
