var assert = require('assert');
var axios = require('axios');

var server = require('./server/');

var PORT = 6868;

var request = axios.create({
	baseURL: `http://localhost:${PORT}/api`
});

before(function (done) {
	server.start(PORT, done);
});

after(function (done) {
	server.stop(done);
});

describe('index as url with tailing slash', function () {
	it('GET / should be ok', function (done) {
		request.get('/').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'hello');
		}, function (http) {
			console.error(http.response.status);
		}).then(done, done);
	});

	it('"GET /(\\d+)/" with regexp number params should be ok', function (done) {
		request.get('/123').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 123);
		}, function (http) {
			console.error(http.response.status);
		}).then(done, done);
	});

	it('GET /some-path/ should be ok', function (done) {
		request.get('/some-path/').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'some-path');
		}, function (http) {
			console.error(http.response.status);
		}).then(done, done);
	});

	it('GET /some-path/123 with regexp number params should be ok', function (done) {
		request.get('/some-path/123').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 123);
		}, function (http) {
			console.error(http.response.status);
		}).then(done, done);
	});
});

describe('filters defined on module should effect all methods', function () {
	it('GET /all.filters method should get the value set by filter', function (done) {
		request.get('/all.filters').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '1');
		}).catch(function (http) {
			console.error(http.response.status);
		}).then(done);
	});

	it('POST /all.filters method should get the value set by filter', function (done) {
		request.post('/all.filters').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '1');
		}).catch(function (http) {
			console.error(http.response.status);
		}).then(done);
	});
});

describe('url pathname with params defined via .params', function () {
	it('GET /sub.action should be 404, cause using regexp and not ignore "/"', function (done) {
		request.get('/sub.action').then(function (res) {
		}).catch(function (http) {
			assert.equal(http.response.status, 404);
		}).then(done);
	});
	it('GET /sub.action/ should be ok', function (done) {
		request.get('/sub.action/').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'ok');
		}).catch(function (http) {
			console.error(http.response.status);
		}).then(done);
	});

	it('GET /sub.action/:id should be the id', function (done) {
		request.get('/sub.action/123').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '123');
		}).catch(function (http) {
			console.error(http.response.status);
		}).then(done);
	});

	it('GET /sub.action/:id/test should be the id', function (done) {
		request.get('/sub.action/123/test').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '123');
		}).catch(function (http) {
			console.error(http.response.status);
		}).then(done);
	});
});

describe('url pathname with params defined via key', function () {
	it('GET /with-params should be ok', function (done) {
		request.get('/with-params').then(function (res) {
			assert.equal(res.status, 204);
		}).then(done);
	});

	it('GET /with-params/123 should be 123', function (done) {
		request.get('/with-params/123').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '123');
		}).then(done);
	});

	it('GET /with-params/abc should be 404', function (done) {
		request.get('/with-params/abc').then(function (res) {
		}).catch(function (http) {
			assert.equal(http.response.status, 404);
		}).then(done);
	});

	it('GET /with-params/abc/comments should be abc', function (done) {
		request.get('/with-params/abc/comments').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'abc');
		}).then(done);
	});
});

describe('ignored controller files', function () {
	it('GET /ignore.me should be 404', function (done) {
		request.get('/ignore.me').then(function (res) {
		}).catch(function (http) {
			assert.equal(http.response.status, 404);
		}).then(done);
	});
});

describe('option controllers as absolute path', function () {
	it('GET /abs/some-path (strict) should be ok', function (done) {
		request.get('/abs/some-path').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'some-path');
		}, function (http) {
			console.error(http.response.status);
		}).then(done, done);
	});

	it('GET /abs/some-path/ (strict) should be 404', function (done) {
		request.get('/abs/some-path/').then(function (res) {
			console.error('should not get here');
		}, function (http) {
			assert.equal(http.response.status, 404);
		}).then(done, done);
	});

	it('GET /abs/all.filters method should get the value', function (done) {
		request.get('/abs/all.filters').then(function (res) {
			assert.equal(res.status, 200);
		}).catch(function (http) {
			console.error(http.response.status);
		}).then(done);
	});
});
