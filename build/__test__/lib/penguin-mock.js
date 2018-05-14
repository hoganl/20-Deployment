'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemovePenguinMock = exports.pCreatePenguinMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _penguin = require('../../model/penguin');

var _penguin2 = _interopRequireDefault(_penguin);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreatePenguinMock = function pCreatePenguinMock() {
  var resultMock = {};

  return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
    resultMock.accountSetMock = accountSetMock;

    return new _penguin2.default({
      name: _faker2.default.name.firstName(),
      species: _faker2.default.lorem.words(2),
      colors: _faker2.default.lorem.words(3),
      location: _faker2.default.lorem.words(2),
      account: accountSetMock.account._id
    }).save();
  }).then(function (penguin) {
    resultMock.penguin = penguin;
    return resultMock;
  });
};

var pRemovePenguinMock = function pRemovePenguinMock() {
  return Promise.all([_penguin2.default.remove({}), (0, _accountMock.pRemoveAccountMock)()]);
};

exports.pCreatePenguinMock = pCreatePenguinMock;
exports.pRemovePenguinMock = pRemovePenguinMock;