var core = require('../core');

var cardMeaning = {};

cardMeaning.buildUrl = function (id) {
    var url = '/card_meaning';
    if (id) {
        url += '/' + id;
    }
    return url;
};

cardMeaning.post = function (data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        body: data,
        method: 'POST'
    });
};

cardMeaning.put = function (id, data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        body: data,
        method: 'PUT'
    });
};

cardMeaning.putBatch = function (data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        body: data,
        method: 'PUT'
    });
};

cardMeaning.patch = function (id, data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        body: data,
        method: 'PATCH'
    });
};

cardMeaning.patchBatch = function (data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        body: data,
        method: 'PATCH'
    });
};

cardMeaning.delete = function (id) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        method: 'DELETE'
    });
};

cardMeaning.deleteBatch = function (ids) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        qs: {id: ids.join(',')},
        method: 'DELETE'
    });
};

cardMeaning.get = function (id, data) {
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

module.exports = cardMeaning;
