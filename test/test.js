var assert = require('assert');
var axios = require('axios');

var server = require('./server/');

var PORT = 6868;

var request = axios.create({
	baseURL: `http://localhost:${PORT}/api`
});

describe('api server', function () {
	before(function () {
		server.start(PORT);
	});

	after(function () {
		server.stop();
	});

	describe('/all.filters', function () {
		it('The GET method should get the value set by filter', function (done) {
			request.get('/all.filters').then(function (res) {
				assert.equal(res.status, 200);
				assert.equal(res.data, '1');
				done();
			}).catch(function (http) {
				console.error(http.response.status);
			});
		});

		it('The POST method should get the value set by filter', function (done) {
			request.post('/all.filters').then(function (res) {
				assert.equal(res.status, 200);
				assert.equal(res.data, '1');
				done();
			}).catch(function (http) {
				console.error(http.response.status);
			});
		});
	});

	describe('/with.dot.action', function () {
		it('GET /with.dot.action/ should be ok', function (done) {
			request.get('/with.dot.action/').then(function (res) {
				assert.equal(res.status, 200);
				assert.equal(res.data, 'ok');
				done();
			}).catch(function (http) {
				console.error(http.response.status);
			});
		});

		it('GET /with.dot.action/:id should be the id', function (done) {
			request.get('/with.dot.action/123').then(function (res) {
				assert.equal(res.status, 200);
				assert.equal(res.data, '123');
				done();
			}).catch(function (http) {
				console.error(http.response.status);
			});
		});

		it('GET /with.dot.action/:id/test should be the id', function (done) {
			request.get('/with.dot.action/123/test').then(function (res) {
				assert.equal(res.status, 200);
				assert.equal(res.data, '123');
				done();
			}).catch(function (http) {
				console.error(http.response.status);
			});
		});
	});
});
