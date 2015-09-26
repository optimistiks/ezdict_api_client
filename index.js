var core = require('./modules/core');
var card = require('./modules/card');
var quizzes = require('./modules/quizzes');
var quizAnswers = require('./modules/quiz-answers');
var meaning = require('./modules/meaning');
var toStudy = require('./modules/to-study');
var suggestedMeaning = require('./modules/suggested-meaning');
var config = require('./modules/config');

var api = {
    config: config,
    core: core,
    card: card,
    meaning: meaning,
    toStudy: toStudy,
    quizzes: quizzes,
    quizAnswers: quizAnswers,
    suggestedMeaning: suggestedMeaning
};

api.buildUrl = function (path) {
    return this.config.getProtocol() + '://' + this.config.getHost() + path + '/';
};

/**
 * call the register api endpoint and save the token if it's present in the response
 * @param data
 * @returns {*}
 */
api.register = function (data) {
    return this.core.sendRequest({
        uri: '/user/register',
        method: 'POST',
        body: data
    }).then(function (response) {
        if (!response.auth_token) {
            return response;
        } else {
            return this.core.saveToken(response.auth_token).then(function () {
                return response;
            });
        }
    }.bind(this));
};

api.login = function (data) {
    return this.core.sendRequest({
        uri: '/user/login',
        method: 'POST',
        body: data
    }).then(function (response) {
        return api.core.saveToken(response.auth_token).then(function () {
            return response;
        });
    });
};

/**
 * call the logout endpoint and remove the token from storage
 * @returns {*}
 */
api.logout = function () {
    return this.core.sendSignedRequest({
        uri: '/user/logout',
        method: 'POST'
    }).then(function () {
        return this.core.removeToken();
    }.bind(this));
};

/**
 * call the translate endpoint
 * @param text
 * @param lang
 * @returns {*}
 */
api.translate = function (text, lang) {
    return this.core.sendSignedRequest({
        uri: '/translation',
        method: 'GET',
        qs: {string: text, lang: lang}
    });
};

api.getLanguages = function () {
    return this.core.sendSignedRequest({
        uri: '/languages',
        method: 'GET'
    });
};

api.getUserInfo = function () {
    return this.core.sendSignedRequest({
        uri: '/user/me',
        method: 'GET'
    });
};

api.getTranslationHistory = function (page) {
    return this.core.sendSignedRequest({
        uri: '/translation_history',
        qs: {page: page},
        method: 'GET'
    });
};

api.getProfile = function () {
    return this.core.sendSignedRequest({
        uri: '/profile',
        method: 'GET'
    });
};

api.updateProfile = function (params) {
    params = params || {};
    var allowedParams = ['target_lang'];
    var body = {};

    //accept only allowed keys from params
    Object.keys(params).forEach(function (key) {
        if (allowedParams.indexOf(key) !== -1) {
            body[key] = params[key];
        }
    });

    return this.core.sendSignedRequest({
        uri: '/profile',
        body: body,
        method: 'POST'
    });
};

module.exports = api;
