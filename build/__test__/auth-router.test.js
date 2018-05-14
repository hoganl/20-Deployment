'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('AUTH Router', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_accountMock.pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'trashpanda',
      email: 'trashpanda@hotmail.me',
      password: 'racoon'
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    });
  });

  test('POST should return a 409 due to duplicate email', function () {
    return _superagent2.default.post(apiURL + '/signup').send({
      username: 'trashpanda',
      email: 'trashpanda@hotmail.me',
      password: 'racoon'
    }).then(function () {
      return _superagent2.default.post(apiURL + '/signup').send({
        username: 'trashpanda',
        email: 'trashpanda@hotmail.me',
        password: 'racoon'
      });
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(409);
    });
  });

  test('POST should return a 400 due to lack of email', function () {
    return _superagent2.default.post(apiURL + '/signup').send({}).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });

  describe('GET /login', function () {
    test('GET /login should get a 200 status code and a TOKEN', function () {
      return (0, _accountMock.pCreateAccountMock)().then(function (mock) {
        return _superagent2.default.get(apiURL + '/login').auth(mock.request.username, mock.request.password);
        // This line is where we are actually making a request with a username and password
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
    });

    test('GET should return a 400 status code', function () {
      return (0, _accountMock.pCreateAccountMock)().then(function () {
        return _superagent2.default.get(apiURL + '/login');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });

    test('GET should return a 404 status code', function () {
      return _superagent2.default.get(apiURL + '/login/BadId').then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(404);
      });
    });
  });
});