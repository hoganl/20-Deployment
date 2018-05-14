'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _bodyParser = require('body-parser');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _penguin = require('../model/penguin');

var _penguin2 = _interopRequireDefault(_penguin);

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = (0, _bodyParser.json)();
var penguinRouter = new _express.Router();

penguinRouter.post('/penguins', _bearerAuthMiddleware2.default, jsonParser, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(400, 'AUTH - invalid request'));
  }
  return new _penguin2.default(_extends({}, request.body, {
    account: request.account._id
  })).save().then(function (penguin) {
    _logger2.default.log(_logger2.default.INFO, 'Returning 200 and a new Penguin');
    return response.json(penguin);
  }).catch(next);
});

penguinRouter.get('/penguins/:id', function (request, response, next) {
  if (!request.params.id) {
    _logger2.default.log(_logger2.default.INFO, 'GET - responding with 400 status code - no id provided');
    return next(new _httpErrors2.default(400, 'GET - invalid request'));
  }
  return _penguin2.default.findById(request.params.id).then(function (penguin) {
    if (!penguin) {
      _logger2.default.log(_logger2.default.INFO, 'GET - responding with a 404 status code - (!penguin');
      return next(new _httpErrors2.default(404, 'AUTH - bad id'));
    }
    _logger2.default.log(_logger2.default.INFO, 'Returning 200 and a new Penguin');
    return response.json(penguin);
  }).catch(next);
});

exports.default = penguinRouter;