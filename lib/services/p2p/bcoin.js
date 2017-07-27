'use strict';

var index = require('../../');
var log = index.log;
var bcoin = require('bcoin');

var Bcoin = function(options) {
  this._config = this._getConfig(options);
};

Bcoin.prototype.start = function() {

  var self = this;
  self._bcoin = bcoin.fullnode(self._config);

  log.info('Starting Bcoin full node...');

  self._bcoin.open().then(function() {
    self._bcoin.connect().then(function() {
      self._bcoin.startSync();
    });
  });

  self._bcoin.chain.on('block', function(block) {
    console.log(block)
  });

  self._bcoin.mempool.on('tx', function(tx) {
    ;
  });

  self._bcoin.chain.on('full', function() {
    node.mempool.getHistory().then(console.log);
  });

};

Bcoin.prototype.stop = function() {
  this._bcoin.stopSync();
  this._bcoin.disconnect();
  this._bcoin.close();
};

// --- privates
Bcoin.prototype._getConfig = function(options) {
  var config = {
    checkpoints: false,
    network: options.network || 'main',
    listen: true
  };
  if (options.prefix) {
    config.prefix = options.prefix;
  }
  if (options.logLevel) {
    config.logLevel = options.logLevel;
  }
  console.log(config)
  return config;
};

module.exports = Bcoin;
