'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _imageMock = require('./lib/image-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('TESTING ROUTES AT /images', function () {
  beforeAll(_server.startServer);
  afterEach(_imageMock.pRemoveImageMock);
  afterAll(_server.stopServer);

  describe('POST', function () {
    test('POST /images should return 200 for successful image post', function () {
      // comment in the below if you have a slow computer AND need to make a real API call to S3
      jest.setTimeout(100000);
      return (0, _imageMock.pCreateImageMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiURL + '/images').set('Authorization', 'Bearer ' + token).field('title', 'royal penguin').attach('image', __dirname + '/assets/royal_penguin.jpg').then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('royal penguin');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (response) {
        expect(response.status).toEqual(200);
      });
    });

    test('POST /images should return a 400 status code for bad request', function () {
      return (0, _imageMock.pCreateImageMock)().then(function () {
        return _superagent2.default.post(apiURL + '/images').send({});
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(400);
      });
    });

    test('POST /images should return a 401 status for bad token', function () {
      return (0, _imageMock.pCreateImageMock)().then(function () {
        return _superagent2.default.post(apiURL + '/images').set('Authorization', 'Bearer ').send({});
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });

  describe('GET', function () {
    test('GET /images/:id should respond with 200 if there are no errors', function () {
      var imageToTest = null;
      return (0, _imageMock.pCreateImageMock)().then(function (image) {
        imageToTest = image;
        return _superagent2.default.get(apiURL + '/images/' + image.image._id).set('Authorization', 'Bearer ' + image.accountMock.token);
      }).then(function (response) {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(imageToTest.image.title);
        expect(response.body.url).toEqual(imageToTest.image.url);
        expect(response.body._id).toBeTruthy();
      });
    });

    test('GET /images/:id should respond with 404 if there is no image found', function () {
      return _superagent2.default.get(apiURL + '/image/BadId').then(Promise.reject).catch(function (err) {
        // console.log(err, 'get 404 error');
        expect(err.status).toEqual(404);
      });
    });

    test('GET /images/:id should respond with 401 status for bad token', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (image) {
        return _superagent2.default.get(apiURL + '/images/' + image.image._id).set('Authorization', 'Bearer ');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });

  describe('DELETE', function () {
    test('DELETE /images/:id should respond with 204 for successful deletion', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (mockImage) {
        return _superagent2.default.delete(apiURL + '/images/' + mockImage.image._id).set('Authorization', 'Bearer ' + mockImage.accountMock.token);
      }).then(function (response) {
        expect(response.status).toEqual(204);
      });
    });

    test('DELETE /images/:id should respond with 404 due to no image found', function () {
      return _superagent2.default.delete(apiURL + '/image/BadId').then(Promise.reject).catch(function (err) {
        // console.log(err, 'delete 404 error');
        expect(err.status).toEqual(404);
      });
    });

    test('DELETE /images/:id should return with 401 status for bad token', function () {
      return (0, _imageMock.pCreateImageMock)().then(function (image) {
        return _superagent2.default.delete(apiURL + '/images/' + image.image._id).set('Authorization', 'Bearer ');
      }).then(Promise.reject).catch(function (err) {
        expect(err.status).toEqual(401);
      });
    });
  });
});