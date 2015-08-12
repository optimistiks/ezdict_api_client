var rp = require('request-promise');
var Promise = require('bluebird');

var api = {
  protocol: 'http',
  host: 'api.ezdict.potapovmax.com',
  locale: 'en',
  storage: {
    getItem: function (key) {
    },
    setItem: function (key, value) {
    },
    removeItem: function (key) {
    }
  }
};

api.setProtocol = function (protocol) {
  this.protocol = protocol;
};

api.setHost = function (host) {
  this.host = host;
};

api.setStorage = function (storage) {
  this.storage = storage;
};

api.setLocale = function (locale) {
  this.locale = locale;
};

api.addLocaleHeader = function (requestOptions) {
  requestOptions.headers = requestOptions.headers || {};
  requestOptions.headers['Accept-Language'] = this.locale;
};

api.buildUrl = function (path) {
  return this.protocol + '://' + this.host + path + '/';
};

api.sendRequest = function (requestOptions) {
  requestOptions = requestOptions || {};
  requestOptions.json = true;
  requestOptions.protocol = this.protocol + ':';
  this.addLocaleHeader(requestOptions);
  return rp(requestOptions)
    .then(function (response) {
      return response;
    }).catch(function (e) {
      throw {statusCode: e.statusCode, error: e.error};
    });
};

/**
 * get the token and add the Authorization header to request
 * @param requestOptions
 * @returns {*}
 */
api.sendSignedRequest = function (requestOptions) {
  return this.getToken().then(function (token) {
    requestOptions.headers = requestOptions.headers || {};
    requestOptions.headers['Authorization'] = 'Token ' + token;
    return this.sendRequest(requestOptions);
  }.bind(this));
};

/**
 * retrieves the token from the storage
 * @returns {*}
 */
api.getToken = function () {
  return Promise.resolve(this.storage.getItem('auth_token')).catch(function () {
    throw {};
  });
};

/**
 * @param token
 * @returns {*}
 */
api.saveToken = function (token) {
  return Promise.resolve(this.storage.setItem('auth_token', token)).catch(function () {
    throw {};
  });
};

/**
 * remove the token from the storage
 * @returns {*}
 */
api.removeToken = function () {
  return Promise.resolve(this.storage.removeItem('auth_token')).catch(function () {
    throw {};
  });
};

/**
 * call the register api endpoint and save the token if it's present in the response
 * @param data
 * @returns {*}
 */
api.register = function (data) {
  return this.sendRequest({
    uri: this.buildUrl('/user/register'),
    method: 'POST',
    body: data
  }).then(function (response) {
    if (!response.auth_token) {
      return response;
    } else {
      return this.saveToken(response.auth_token).then(function () {
        return response;
      });
    }
  }.bind(this));
};

api.login = function (data) {
  return this.sendRequest({
    uri: this.buildUrl('/user/login'),
    method: 'POST',
    body: data
  }).then(function (response) {
    return api.saveToken(response.auth_token).then(function () {
      return response;
    });
  });
};

/**
 * call the logout endpoint and remove the token from storage
 * @returns {*}
 */
api.logout = function () {
  return this.sendSignedRequest({
    uri: this.buildUrl('/user/logout'),
    method: 'POST'
  }).then(function () {
    return this.removeToken();
  }.bind(this));
};

/**
 * call the translate endpoint
 * @param string
 * @returns {*}
 */
api.translate = function (string) {
  return this.sendSignedRequest({
    uri: this.buildUrl('/translation'),
    method: 'GET',
    qs: {string: string}
  });
};

api.getUserInfo = function () {
  return this.sendSignedRequest({
    uri: this.buildUrl('/user/me'),
    method: 'GET'
  });
};

api.getTranslationHistory = function (page) {
  return this.sendSignedRequest({
    uri: this.buildUrl('/translation_history'),
    qs: {page: page},
    method: 'GET'
  });
};

api.getWordsLearning = function (page) {
  return this.sendSignedRequest({
    uri: this.buildUrl('/word/learning'),
    qs: {page: page},
    method: 'GET'
  });
};

api.createWordLearning = function (word) {
  return this.sendSignedRequest({
    uri: this.buildUrl('/word/learning'),
    body: {string: word},
    method: 'POST'
  });
};

module.exports = api;
