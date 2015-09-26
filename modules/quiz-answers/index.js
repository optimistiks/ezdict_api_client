var core = require('../core');

var quizAnswers = {};

quizAnswers.buildUrl = function (id) {
    var url = '/quiz_answers';
    if (id) {
        url += '/' + id;
    }
    return url;
};

quizAnswers.post = function (data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        body: data,
        method: 'POST'
    });
};

quizAnswers.get = function (id, data) {
    //todo: DRY violation
    // id + data or id only
    if ((id && data) || !data) {
        data = {};
    }
    //data only
    if (typeof id === 'object') {
        data = id;
        id = null;
    }
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        method: 'GET',
        qs: data
    });
};

module.exports = quizAnswers;
