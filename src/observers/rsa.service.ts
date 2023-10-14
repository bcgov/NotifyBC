import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import crypto from 'crypto';
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
    if (data) return;

    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      await promisify(setTimeout)(5000);
      await this.onApplicationBootstrap();
      return;
    }
    // only the node with cron enabled, which is supposed to be a singleton,
    // can generate RSA key pair by executing code below
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    await this.configurationsService.create(
      {
        name: 'rsa',
        value: {
          private: privateKey,
          public: publicKey,
        },
      },
      undefined,
    );
    return;
  }
}
