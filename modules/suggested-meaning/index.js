var core = require('../core');

var suggestedMeaning = {};

suggestedMeaning.buildUrl = function () {
  return '/suggested_meanings';
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
