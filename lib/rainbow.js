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
	function route (app, method, url, router) {
		var filters = (router.filters || []).map(function (item) {
			return require(path.join(fltrDir, item));
		});
		
		app[method].apply(app, [joinParam(url, router.params)]
			.concat(filters)
			.concat([router]));
	}
	
	paths = paths || {};
	var ctrlDir = path.join(approot, (paths.controllers || 'controllers'));
	var fltrDir = path.join(approot, (paths.filters || 'filters'));
	
	glob.sync(ctrlDir + "/**/*\.+(coffee|js)").forEach(function (file) {
		file = file.replace(/\.[^.]*$/, '');
		var router = require(file);
		var single = typeof router == 'function';
		var url = file.replace(ctrlDir, '').replace(/\/index$/, '/');
		
		single ? route(app, 'all', url, router) :
			methods.forEach(function (method) {
				var eachRouter = router[method];
				if (eachRouter) {
					route(app, method, url, eachRouter);
				}
			});
	});
};
