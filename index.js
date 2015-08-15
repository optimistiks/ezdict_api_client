var rp = require('request-promise');
var Promise = require('bluebird');

var config = require('./modules/config');

var api = {};
api.config = config;

api.setProtocol = function (protocol) {
  this.config.setProtocol(protocol);
};

api.setHost = function (host) {
  this.config.setHost(host);
};

api.setStorage = function (storage) {
  this.config.setStorage(storage);
};

api.setLocale = function (locale) {
  this.config.setLocale(locale);
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
 * @param text
 * @param lang
 * @returns {*}
 */
api.translate = function (text, lang) {
  return this.sendSignedRequest({
    uri: this.buildUrl('/translation'),
    method: 'GET',
    qs: {string: text, lang: lang}
  });
};

api.getLanguages = function () {
  return this.sendSignedRequest({
    uri: this.buildUrl('/language'),
    method: 'GET'
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

api.getProfile = function () {
  return this.sendSignedRequest({
    uri: this.buildUrl('/profile'),
    method: 'GET'
  });
};

api.updateProfile = function (params) {
  params = params || {};
  var allowedParams = ['target_lang'];
  var body = {};

  Object.keys(params).forEach(function (key) {
    if (allowedParams.indexOf(key) !== -1) {
      body[key] = params[key];
    }
  });

  return this.sendSignedRequest({
    uri: this.buildUrl('/profile'),
    body: body,
    method: 'POST'
  });
};

module.exports = api;
