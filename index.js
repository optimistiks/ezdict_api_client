var rp = require('request-promise');
var Promise = require('bluebird');

var api = {
  URL: 'http://api.ezdict.potapovmax.com',
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
  return this.URL + path + '/';
};

api.sendRequest = function (requestOptions) {
  requestOptions = requestOptions || {};
  this.addLocaleHeader(requestOptions);
  return rp(requestOptions)
    .then(function (response) {
      return JSON.parse(response);
    }).catch(function (e) {
      throw JSON.parse(e.error);
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
  return Promise.resolve(this.storage.getItem('auth_token'));
};

/**
 * @param token
 * @returns {*}
 */
api.saveToken = function (token) {
  return Promise.resolve(this.storage.setItem('auth_token', token));
};

/**
 * remove the token from the storage
 * @returns {*}
 */
api.removeToken = function () {
  return Promise.resolve(this.storage.removeItem('auth_token'));
};

/**
 * call the register api endpoint and save the token if it's present in the response
 * @param formData
 * @returns {*}
 */
api.register = function (formData) {
  return this.sendRequest({
    uri: this.buildUrl('/user/register'),
    method: 'POST',
    form: formData
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

api.login = function (formData) {
  return this.sendRequest({
    uri: this.buildUrl('/user/login'),
    method: 'POST',
    form: formData
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
    type: 'GET'
  });
};

module.exports = api;
