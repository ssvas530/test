var request = require('supertest');

before(function() {
    var View = require('../models/views');
    var User = require('../models/user');

    var createUser = function(body) {
        var user = new User(body);
        user.save(body, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                console.log(result);
            }
        });
    };
    var createView = function(body) {
        var view = new View(body);
        view.save(body, function(err, result) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                console.log(result);
            }
        });
    };
    createUser({
        "name": "Jinto",
        "userid": "jintoj",
        "apikey": "23456",
        "password": "jinto",
        "email": "jinto"
    });
    createUser({
        "name": "Jinto",
        "userid": "jinto",
        "apikey": "23456",
        "password": "jinto",
        "email": "jinto"
    });
    createView({
        "name": "Marks >= 40",
        "viewid": "marks_ge_40",
        "query": "[{\"name\":\"Harris\"}]",
        "atomic": true,
        "userid": "jinto",
        "dbid": "students"
    });
    createView({
        "name": "Marks = 80",
        "viewid": "marks_eq_80",
        "query": "[{\"name\":\"Harris\"}]",
        "atomic": false,
        "userid": "jinto",
        "dbid": "students"
    });
    createView({
        "name": "Marks < 40",
        "viewid": "marks_lt_40",
        "query": "[{\"name\":\"Harris\"},{\"name\":\"John\"},{\"name\":\"Patrick\"}]",
        "atomic": true,
        "userid": "jintoj",
        "dbid": "students"
    });
});

describe('Request Parser -', function() {
    var server;
    beforeEach(function() {
        server = require('../server');
    });
    afterEach(function() {
        server.close();
    });
    it('responds to /  -- 404', function testSlash(done) {
        request(server)
            .get('/')
            .expect(404, done);
    });
    it('responds to invalid apikey', function testSlash(done) {
        request(server)
            .get('/vizibus/jinto/marks_ge_40?apikey=1234')
            .expect(401, done);
    });
    it('responds to invalid user id', function testSlash(done) {
        request(server)
            .get('/vizibus/any_user/marks_ge_40?apikey=23456')
            .expect(401, done);
    });
    it('responds to invalid view id', function testSlash(done) {
        request(server)
            .get('/vizibus/jinto/other_view_id?apikey=23456')
            .expect(403, done);
    });
    it('responds to non-owned view id', function testSlash(done) {
        request(server)
            .get('/vizibus/jintoj/marks_ge_40?apikey=23456')
            .expect(403, done);
    });
    it('responds to valid url', function testSlash(done) {
        request(server)
            .get('/vizibus/jinto/marks_ge_40?apikey=23456')
            .expect(200)
            .expect(function(res) {
                if (res.body.data.length === 1) {
                    return true;
                }
                return new Error('Invalid data');
            })
            .end(done);
    });
    it('responds to valid url with filters to dynamic view', function testSlash(
        done) {
        request(server)
            .get(
                '/vizibus/jinto/marks_eq_80/key1/value1/key2/value2?apikey=23456&startIndex=20&rowCount=10'
            )
            .expect(200, {
                "totalCount": 0,
                "startIndex": 20,
                "data": [],
                "rowCount": 0
            }, done);
    });
    it('responds to valid url with filters  to atomic view', function testSlash(
        done) {
        request(server)
            .get(
                '/vizibus/jintoj/marks_lt_40/key1/value1/key2/value2?apikey=23456&startIndex=0&rowCount=10'
            )
            .expect(200)
            .expect(function(res) {
                if (res.body.data.length === 3) {
                    return true;
                }
                return new Error('Invalid data');
            })
            .end(done);
    });
    it('responds to valid url with filters', function testSlash(done) {
        request(server)
            .get(
                '/vizibus/jintoj/marks_lt_40/key1/value1/key2/value2?apikey=23456&startIndex=0&rowCount=1'
            )
            .expect(200)
            .expect(function(res) {
                if (res.body.data.length === 1) {
                    return true;
                }
                return new Error('Invalid data');
            })
            .end(done);
    });
    it('404 everything else', function testPath(done) {
        request(server)
            .get('/vizibus/bar')
            .expect(404, done);
    });
});
