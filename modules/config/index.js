var config = {
  protocol: 'http',
  host: 'api.ezdict.potapovmax.com',
  locale: 'en',
  storage: {
    getItem: function (key) {
    },
    setItem: function (key, value) {
    },
    removeItem: function (key) {
    }
  }
};

config.setProtocol = function (protocol) {
  this.protocol = protocol;
};

config.setHost = function (host) {
  this.host = host;
};

config.setStorage = function (storage) {
  this.storage = storage;
};

config.setLocale = function (locale) {
  this.locale = locale;
};

module.exports = config;
