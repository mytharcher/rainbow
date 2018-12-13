Rainbow
=======

A node [Express][] router middleware for RESTful API base on certain folder path.

Rainbow mapping all HTTP request route to controllers folder each as path to file as URL.

Installation
----------

~~~bash
$ npm install rainbow
~~~

Usage
----------

In your express application main file `app.js`:

~~~javascript
var express = require('express');
var rainbow = require('rainbow');

var app = express();

// Here using Rainbow to initialize all routers
app.use('/api', rainbow());

app.listen(6060);
~~~

Controllers
----------

All your controllers for catching HTTP request should be defined in each file in `controllers/` folder (could be changed) as same path in URL.

This is the core design for Rainbow! And it makes routing much simpler only by files' paths!

Here writes a router `something.js` in your `controllers/` folder like this:

~~~javascript
exports.GET = function (req, res) {
	res.send(200, 'Simple getting.');
};
~~~

If you need some filters, just use an array (**RECOMMENDED**), or add a `filters` array property which contains your filters each as a function to the handle function like this:

~~~javascript
var authorization = require('authorization');

exports.GET = [authorization, function (req, res) {
	res.send(200, 'Using middleware queue array');
}];

// or
exports.GET = function (req, res) {
	res.send(200, 'Simple getting.');
};
// add filters
exports.GET.filters = [authorization];
~~~

Also you could define other HTTP methods handlers, but make sure in one file each URL! Example in `controllers/user.js`:

~~~javascript
exports.GET = function (req, res) {
	User.find({where: req.query.name}).success(function (user) {
		res.send(200, user);
	});
};

exports.PUT = function (req, res) {
	User.create(req.body).success(function (user) {
		res.send(201, user.id);
	});
};

// You can also define `post` and `delete` handlers.
// ...
~~~

If you want all methods to be process in only one controller(something not RESTful), just make exports to be the handle function:

~~~javascript
module.exports = function (req, res) {
	// all your process
};
~~~

Params
----------

Params config is supported via router key definition (**RECOMMENDED**) from v2.0.0. Now you can define express-like routers as a form of `<method> <params>`. Named params form as in express could be same like `:name`, while regular expression form should also use string type and wrapped with `/` at beginning and end. Here are examples:

~~~javascript
// normal router without params
// will match when GET with no params
exports.GET = function (req, res) {};

// router with named params
// will match when GET /:username
exports['GET :username'] = function (req, res) {
	res.send(req.params.username);
};

// router with regular expression params
// will match when GET /123/profile
exports['GET /(\\d+)/profile/'] = function (req, res) {
	res.send('profile by user id: ' + req.params[0]);
};
~~~

Params config is also supported via `.params` form URL from v0.1.0. You can define your controllers URL with params resolved by native Express like this:

~~~javascript
exports.GET = function (req, res) {
	var id = req.params.id;
	// your business
};

exports.GET.params = ':id?';
~~~

Or you can use regular expression also:

~~~javascript
exports.GET = function (req, res) {
	console.log(req.params);
}

exports.GET.params = /(\d+)(?:\.\.(\d+))?/;
~~~

But make sure no regular expression `^` used as starter and `$` as ender, or rainbow could not resolve the expression correctly. And be aware of the tailing slash when using `.params` definition, the `GET /resource` will be not found, while `GET /resources/` would be match.

Filters
----------

Filter is as same as a origin middleware in Express. Define an action with filters by using `.filters` property as an array. Here `authorization.js` is a example for intecepting by non-authenticated user before `GET` `http://yourapp:6060/something`:

~~~javascript
module.exports = function (req, res, next) {
	console.log('processing authorization...');
	var session = req.session;
	
	if (session.userId) {
		console.log('user(%d) in session', session.userId);
		next();
	} else {
		console.log('out of session');
		// Async filter is ok with express!
		db.User.find().success(function (user) {
			if (!user) {
				res.send(403);
				res.end();
			}
		});
	}
};
~~~

Filters only support function from v1.0.0.

~~~javascript
// controller file test.js route to [GET]/test
function myFilter (req, res, next) {
	// blablabla...
	next();
}

exports.GET = function (req, res) {
	// blablabla...
};

exports.GET.filters = [myFilter];
~~~

If you need some filters to be applied for all methods in an URL, you could use URL level filters definition:

~~~javascript
// controller file test.js route to [GET|POST]/test
exports.GET = function (req, res) {};
exports.POST = function (req, res) {};
exports.POST.filters = [validation];
exports.filters = [session];
~~~

When user `GET:/test` the filter `session` would run, and when `POST:/test` URL level filter `session` run first and then `validation`.

Options
----------

### Change default path ###

Controllers default path could be changed by passing a path config object to `route` function when initializing:

~~~javascript
app.use(rainbow({
	controllers: 'controllers/path'
}));
~~~

Path option here supports both **RELATIVE** and **ABSOLUTE** path. The relative path will be calculated base on your `app.js` file.

### Glob ###

From v2.1.0 you could use `glob` in options to config any option supported by npm [glob](https://www.npmjs.com/package/glob), such as excluding files.

~~~javascript
app.use(rainbow({
	glob: {
		ignore: [
			'**.spec.js' // any spec file for test cases will be ignored from controller folder
		]
	}
}));
~~~

### Express router options ###

From v2.3.0 rainbow added [express router option](http://expressjs.com/en/api.html#express.router) `strict` into options, default to `false`.

~~~javascript
app.use(rainbow({ strict: true }));
~~~

Change log
----------

### 2.2.0 ###

* Add both absolute and relative controller path configuration support.

### 2.1.1 ###

* Fix [#6](https://github.com/mytharcher/rainbow/issues/6): chaining express application requiring controller path issue caused by node module cache. So that rainbow cannot be cached when using multi requiring.

### 2.1.0 ###

* Add `glob` option for more glob configurations.

### 2.0.0 ###

* Parameters definition supports key form with HTTP method (e.g.: `GET :id`).
* Option of controllers path changed from absolute to relative.

### 1.0.0 ###

* Main API changed from `rainbow.route(app)` to `app.use(rainbow())`.
* Add `function` type support for filters definition.
* Remove `string` named filters definition. Also remove the filters path option in config.
* Add `Array` type support for router definition.
* Remove `.coffee` support.
* Add test cases.

Troubleshooting
----------

0. Gmail me: mytharcher
0. Write a [issue](https://github.com/mytharcher/rainbow/issues)
0. Send your pull request to me.

## MIT Licensed ##

-EOF-

[Express]: http://expressjs.com/
