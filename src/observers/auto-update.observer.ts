import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {NotifyBcApplication} from '../application';
import {ConfigurationRepository} from '../repositories';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class AutoUpdateObserver implements LifeCycleObserver {
  constructor(
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      return;
    }
    const pjson = require('../../package.json');
    const semver = require('semver');
    const targetVersion = pjson.dbSchemaVersion;
    let data = await this.configurationRepository.findOne({
      where: {name: 'dbSchemaVersion'},
    });
    if (!data) {
      data = await this.configurationRepository.create({
        name: 'dbSchemaVersion',
        value: '0.0.0',
      });
    }
    const currentVersion = data.value;
    if (
      semver.major(targetVersion) === semver.major(currentVersion) &&
      semver.minor(targetVersion) > semver.minor(currentVersion)
    ) {
      await (this.app as NotifyBcApplication).migrateSchema();
      data.value = targetVersion;
      this.configurationRepository.update(data);
      return;
    } else {
      return;
    }
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
