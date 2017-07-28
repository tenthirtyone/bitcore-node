'use strict';

var index = require('../../');
var log = index.log;
var bcoin = require('bcoin');
var EE = require('events').EventEmitter;

var Bcoin = function(options) {
  this._config = this._getConfig(options);
  this.emitter = new EE();
};

Bcoin.prototype.start = function() {
  var self = this;
  self._bcoin = bcoin.fullnode(self._config);

  log.info('Starting Bcoin full node...');

  self._bcoin.open().then(function() {
    self._bcoin.connect().then(function() {
      self._bcoin.startSync();

      self._bcoin.chain.on('block', function(block) {
        console.log('block');
        self.emitter.emit('connect');
      })

      self._bcoin.chain.on('full', function()  {
        P2P._options.peers = [{ ip: { v4: '127.0.0.1' }, port: 48444}];

      });
    });
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
    checkpoints: true,
    network: options.network || 'main',
    listen: true,
    db: 'leveldb',
    port: options.port || 48444,
  };
  if (options.prefix) {
    config.prefix = options.prefix;
  }
  if (options.logLevel) {
    config.logLevel = options.logLevel;
  }
  return config;
};

module.exports = Bcoin;
