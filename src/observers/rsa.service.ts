import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import NodeRSA from 'node-rsa';
import { ConfigurationsService } from 'src/api/configurations/configurations.service';
import { promisify } from 'util';

@Injectable()
export class RsaService implements OnApplicationBootstrap {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  /**
   * This method will be invoked when the application starts
   */
  async onApplicationBootstrap(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const data = await this.configurationsService.findOne({
      where: {
        name: 'rsa',
      },
    });
    const key = new NodeRSA();
    if (data) {
      key.importKey(data.value.private, 'private');
      key.importKey(data.value.public, 'public');
      module.exports.key = key;
      return;
    }
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      await promisify(setTimeout)(5000);
      await this.onApplicationBootstrap();
      return;
    }
    // only the node with cron enabled, which is supposed to be a singleton,
    // can generate RSA key pair by executing code below
    key.generateKeyPair();
    module.exports.key = key;
    await this.configurationsService.create(
      {
        name: 'rsa',
        value: {
          private: key.exportKey('private'),
          public: key.exportKey('public'),
        },
      },
      undefined,
    );
    return;
  }
}
