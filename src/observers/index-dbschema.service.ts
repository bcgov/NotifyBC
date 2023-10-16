import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';

@Injectable()
export class IndexDBSchemaService implements OnApplicationBootstrap {
  constructor(
    private readonly configurationsService: ConfigurationsService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async onApplicationBootstrap(): Promise<void> {
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      return;
    }
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const pJson = require('../../package.json');
    const semver = require('semver');
    const targetVersion = pJson.dbSchemaVersion;
    let data = await this.configurationsService.findOne({
      where: { name: 'dbSchemaVersion' },
    });
    if (!data) {
      data = await this.configurationsService.create({
        name: 'dbSchemaVersion',
        value: '0.0.0',
      });
    }
    const currentVersion = data.value;
    if (
      semver.major(targetVersion) === semver.major(currentVersion) &&
      semver.minor(targetVersion) > semver.minor(currentVersion)
    ) {
      await this.connection.syncIndexes();
      data.value = targetVersion;
      await this.configurationsService.updateById(data.id, data);
      return;
    } else {
      return;
    }
  }
}
