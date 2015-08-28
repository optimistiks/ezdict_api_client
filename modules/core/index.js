var Promise = require('bluebird');
var config = require('../config');
var rp = require('request-promise');

var core = {};

core.buildUrl = function (path) {
    return config.getProtocol() + '://' + config.getHost() + path + '/';
};

/**
 * retrieves the token from the storage
 * @returns {*}
 */
core.getToken = function () {
    return Promise.resolve(config.getStorage().getToken()).catch(function () {
        throw {};
    });
};

/**
 * @param token
 * @returns {*}
 */
core.saveToken = function (token) {
    return Promise.resolve(config.getStorage().saveToken(token)).catch(function () {
        throw {};
    });
};

/**
 * remove the token from the storage
 * @returns {*}
 */
core.removeToken = function () {
    return Promise.resolve(config.getStorage().removeToken()).catch(function () {
        throw {};
    });
};

core.addLocaleHeader = function (requestOptions) {
    requestOptions.headers = requestOptions.headers || {};
    requestOptions.headers['Accept-Language'] = config.getLocale();
};

core.sendRequest = function (requestOptions) {
    requestOptions = requestOptions || {};
    requestOptions.uri = this.buildUrl(requestOptions.uri);
    requestOptions.json = true;
    requestOptions.protocol = config.getProtocol() + ':';
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
core.sendSignedRequest = function (requestOptions) {
    return this.getToken().then(function (token) {
        requestOptions.headers = requestOptions.headers || {};
        requestOptions.headers['Authorization'] = 'Token ' + token;
        return this.sendRequest(requestOptions);
    }.bind(this));
};

module.exports = core;
