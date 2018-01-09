var assert = require('assert');
var axios = require('axios');

var server = require('./server/');

var PORT = 6868;

var request = axios.create({
	baseURL: `http://localhost:${PORT}/api`
});

var file = axios.create({
	baseURL: `http://localhost:${PORT}/`
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
			assert.fail();
		}).then(done, done);
	});

	it('GET /(\\d+)/ with regexp number params should be ok', function (done) {
		request.get('/123').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 123);
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});

	it('GET /some-path/ should be ok', function (done) {
		request.get('/some-path/').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'some-path');
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});

	it('GET /some-path/234 with regexp number params should be ok', function (done) {
		request.get('/some-path/234').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 234);
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});
});

describe('filters defined on module should effect all methods', function () {
	it('GET /all.filters method should get the value set by filter', function (done) {
		request.get('/all.filters').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '1');
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});

	it('POST /all.filters method should get the value set by filter', function (done) {
		request.post('/all.filters').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '1');
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});
});

describe('url pathname with params defined via .params', function () {
	it('GET /sub.action should be 404, cause using regexp and not ignore "/"', function (done) {
		request.get('/sub.action').then(function (res) {
			assert.fail();
		}).catch(function (http) {
			assert.equal(http.response.status, 404);
		}).then(done);
	});
	it('GET /sub.action/ should be ok', function (done) {
		request.get('/sub.action/').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'ok');
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});

	it('GET /sub.action/:id should be the id', function (done) {
		request.get('/sub.action/345').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '345');
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});

	it('GET /sub.action/:id/test should be the id', function (done) {
		request.get('/sub.action/456/test').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '456');
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});
});

describe('url pathname with params defined via key', function () {
	it('GET /with-params should be ok', function (done) {
		request.get('/with-params').then(function (res) {
			assert.equal(res.status, 204);
		}, function (http) {
			assert.fail();
		}).then(done);
	});

	it('GET /with-params/567 should be 567', function (done) {
		request.get('/with-params/567').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, '567');
		}, function (http) {
			assert.fail();
		}).then(done);
	});

	it('GET /with-params/abc should be 404', function (done) {
		request.get('/with-params/abc').then(function (res) {
			assert.fail();
		}, function (http) {
			assert.equal(http.response.status, 404);
		}).then(done, done);
	});

	it('GET /with-params/abc/comments should be abc', function (done) {
		request.get('/with-params/abc/comments').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'abc');
		}, function (http) {
			assert.fail();
		}).then(done, done);
	});
});

describe('ignored controller files', function () {
	it('GET /index.spec should be 404', function (done) {
		request.get('/index.spec').then(function (res) {
			console.log(res.status);
			assert.fail();
		}, function (http) {
			assert.equal(http.response.status, 404);
		}).then(done, done);
	});

	it('GET /ignore.me should be 404', function (done) {
		request.get('/ignore.me').then(function (res) {
			console.log(res.status);
			assert.fail();
		}, function (http) {
			assert.equal(http.response.status, 404);
		}).then(done, done);
	});
});

describe('option controllers as absolute path', function () {
	it('GET /abs/some-path (strict) should be ok', function (done) {
		request.get('/abs/some-path').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'some-path');
		}, function (http) {
			console.error(http.response.status);
			assert.fail();
		}).then(done, done);
	});

	it('GET /abs/some-path/ (strict) should be 404', function (done) {
		request.get('/abs/some-path/').then(function (res) {
			assert.fail();
			console.error('should not get here');
		}, function (http) {
			assert.equal(http.response.status, 404);
		}).then(done, done);
	});

	it('GET /abs/some-path/678 (strict) should be 678', function (done) {
		request.get('/abs/some-path/678').then(function (res) {
			assert.equal(res.data, '678');
		}, function (http) {
			assert.fail();
		}).then(done, done);
	});

	it('GET /abs/some-path/678/abc.txt (strict) should be 404', function (done) {
		request.get('/abs/some-path/678/abc.txt').then(function (res) {
			assert.fail(res.status, 404);
		}, function (http) {
			assert.equal(http.response.status, 404);
		}).then(done, done);
	});

	it('GET /abs/all.filters method should get the value', function (done) {
		request.get('/abs/all.filters').then(function (res) {
			assert.equal(res.status, 200);
		}).catch(function (http) {
			assert.fail();
			console.error(http.response.status);
		}).then(done, done);
	});
});

describe('static paths', function () {
	it('GET /public/ should be the index file content', function (done) {
		file.get('/public/').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'hello');
		}, function (http) {
			assert.fail(http.response.status, 200);
		}).then(done, done);
	});

	it('GET /public/some-path/678/abc.txt should be the file content', function (done) {
		file.get('/public/some-path/678/abc.txt').then(function (res) {
			assert.equal(res.status, 200);
			assert.equal(res.data, 'test');
		}, function (http) {
			assert.fail(http.response.status, 200);
		}).then(done, done);
	});
});
