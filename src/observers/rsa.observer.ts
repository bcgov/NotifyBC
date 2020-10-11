import {
  Application,
  CoreBindings,
  inject,
  LifeCycleObserver,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ConfigurationRepository} from '../repositories';
const fs = require('fs');
const path = require('path');
var NodeRSA = require('node-rsa');

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
//@lifeCycleObserver('database')
export class RsaObserver implements LifeCycleObserver {
  constructor(
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    let configurationRepository: ConfigurationRepository = await this.app.get<
      ConfigurationRepository
    >('repositories.ConfigurationRepository');
    let data = await configurationRepository.findOne({
      where: {
        name: 'rsa',
      },
    });
    var key = new NodeRSA();
    if (data) {
      key.importKey(data.value.private, 'private');
      key.importKey(data.value.public, 'public');
      module.exports.key = key;
      return;
    }
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      setTimeout(this.start, 5000);
      return;
    }
    // only the node with cron enabled, which is supposed to be a singleton,
    // can generate RSA key pair by executing code below
    key.generateKeyPair();
    module.exports.key = key;
    await configurationRepository.create({
      name: 'rsa',
      value: {
        private: key.exportKey('private'),
        public: key.exportKey('public'),
      },
    });
    return;
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
