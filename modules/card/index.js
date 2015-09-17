var core = require('../core');

var card = {};

card.buildUrl = function (id) {
    var url = '/cards';
    if (id) {
        url += '/' + id;
    }
    return url;
};

card.post = function (data) {
    return core.sendSignedRequest({
        uri: '/cards',
        body: data,
        method: 'POST'
    });
};

card.put = function (id, data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        body: data,
        method: 'PUT'
    });
};

card.patch = function (id, data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        body: data,
        method: 'PATCH'
    });
};

card.get = function (id, data) {
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

module.exports = card;
