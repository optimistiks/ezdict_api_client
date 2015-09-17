var core = require('../core');

var meaning = {};

meaning.buildUrl = function (id) {
    var url = '/card_meanings';
    if (id) {
        url += '/' + id;
    }
    return url;
};

meaning.post = function (data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        body: data,
        method: 'POST'
    });
};

meaning.put = function (id, data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        body: data,
        method: 'PUT'
    });
};

meaning.putBatch = function (data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        body: data,
        method: 'PUT'
    });
};

meaning.patch = function (id, data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        body: data,
        method: 'PATCH'
    });
};

meaning.patchBatch = function (data) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        body: data,
        method: 'PATCH'
    });
};

meaning.delete = function (id) {
    return core.sendSignedRequest({
        uri: this.buildUrl(id),
        method: 'DELETE'
    });
};

meaning.deleteBatch = function (ids) {
    return core.sendSignedRequest({
        uri: this.buildUrl(),
        qs: {id: ids.join(',')},
        method: 'DELETE'
    });
};

meaning.get = function (id, data) {
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

module.exports = meaning;
