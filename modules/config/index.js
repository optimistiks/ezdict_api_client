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

config.getProtocol = function () {
  return this.protocol;
};

config.setHost = function (host) {
  this.host = host;
};

config.getHost = function () {
  return this.host;
};

config.setStorage = function (storage) {
  this.storage = storage;
};

config.getStorage = function () {
  return this.storage;
};

config.setLocale = function (locale) {
  this.locale = locale;
};

config.getLocale = function () {
  return this.locale;
};

module.exports = config;
