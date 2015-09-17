var core = require('../core');

var toStudy = {};

toStudy.buildUrl = function (id) {
    var url = '/cards_to_study';
    if (id) {
        url += '/' + id;
    }
    return url;
};

toStudy.post = function (data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        body: data,
        method: 'POST'
    });
};

toStudy.delete = function (id) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        method: 'DELETE'
    });
};

toStudy.get = function (id, data) {
    // todo: DRY violation
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

module.exports = toStudy;
