var core = require('../core');

var card = {};

card.buildUrl = function (id) {
    return '/card/:id'.replace(':id', id ? id : '');
};

card.post = function (data) {
    return core.sendSignedRequest({
        uri: '/card',
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
