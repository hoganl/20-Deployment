'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _accountMock = require('./lib/account-mock');

var _penguinMock = require('./lib/penguin-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('POST /penguins', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_penguinMock.pRemovePenguinMock);

  test('POST /penguins should get a 200 and the newly created penguin', function () {
    var accountMock = null;
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/penguins').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        name: 'Bob',
        species: 'Royal',
        colors: 'black, white, and orange',
        location: 'Antarctica'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.name).toEqual('Bob');
      expect(response.body.species).toEqual('Royal');
      expect(response.body.colors).toEqual('black, white, and orange');
      expect(response.body.location).toEqual('Antarctica');
    });
  });

  test('POST /penguins should return a 400 status code for bad request', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      return _superagent2.default.post(apiURL + '/penguins').set('Authorization', 'Bearer ' + accountSetMock.token).send({});
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(400);
    });
  });

  test('POST /penguins should return a 404 status code', function () {
    var penguinToPost = {
      name: 'Bob',
      species: 'Royal',
      colors: 'black, white, and orange',
      location: 'Antarctica'
    };
    return _superagent2.default.post(apiURL + '/penguins/BadId').send(penguinToPost).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });

  test('GET /penguins/:id should respond with 200 if there are no errors', function () {
    var penguinToTest = null;
    return (0, _penguinMock.pCreatePenguinMock)().then(function (penguin) {
      penguinToTest = penguin;
      return _superagent2.default.get(apiURL + '/penguins/' + penguin.penguin._id);
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.name).toEqual(penguinToTest.penguin.name);
      expect(response.body.species).toEqual(penguinToTest.penguin.species);
      expect(response.body.colors).toEqual(penguinToTest.penguin.colors);
      expect(response.body.location).toEqual(penguinToTest.penguin.location);
      expect(response.body._id).toBeTruthy();
    });
  });

  // test('GET /penguins should return a 400 status code', () => {
  //   return pCreatePenguinMock()
  //     .then(() => {
  //       return superagent.get(`${apiURL}/penguins`);
  //     })
  //     .then(Promise.reject)
  //     .catch((err) => {
  //       expect(err.status).toEqual(400);
  //     });
  // });

  test('GET /penguins should respond with 404 is there is no penguin to be found', function () {
    return _superagent2.default.get(apiURL + '/BadId').then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});