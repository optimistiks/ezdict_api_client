var core = require('../core');

var suggestedMeaning = {};

suggestedMeaning.buildUrl = function () {
  var url = '/suggested_meaning';
  return url;
};

suggestedMeaning.get = function (text, lang) {
  return core.sendSignedRequest({
    uri: this.buildUrl(),
    method: 'GET',
    qs: {
      string: text,
      lang: lang
    }
  });
};

module.exports = suggestedMeaning;
