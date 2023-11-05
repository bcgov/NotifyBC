import { Injectable, OnModuleInit } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { FilterDto } from 'src/api/common/dto/filter.dto';
import { AppConfigService } from 'src/config/app-config.service';
import { OidcDiscoveryService } from './observers/oidc-discovery.service';
const packageJson = require('../package.json');

@Injectable()
export class SwaggerService implements OnModuleInit {
  readonly appConfig;
  static app: NestExpressApplication;
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly oidcDiscoveryService: OidcDiscoveryService,
  ) {
    this.appConfig = appConfigService.get();
  }

  onModuleInit() {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('NotifyBC')
      .setExternalDoc(
        './openapi.json',
        `${this.appConfig.restApiRoot}/explorer-json`,
      )
      .setDescription(packageJson.description)
      .setVersion(packageJson.version)
      .addSecurity('accessToken', {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      })
      .build();
    const document = SwaggerModule.createDocument(
      SwaggerService.app,
      swaggerConfig,
      {
        extraModels: [FilterDto],
      },
    );
    SwaggerModule.setup(
      `${this.appConfig.restApiRoot}/explorer`,
      SwaggerService.app,
      document,
      {
        customJs: '/iframeResizer.contentWindow.min.js',
        patchDocumentOnRequest(
          req: any,
          _res: unknown,
          document: OpenAPIObject,
        ) {
          let colonPort = ':' + req.connection.localPort;
          if (req.connection.localPort === 80 && req.protocol === 'http')
            colonPort = '';
          if (req.connection.localPort === 443 && req.protocol === 'https')
            colonPort = '';
          const url = `${req.protocol}://${req.hostname}${colonPort}`;
          if (!document.servers.find((v: any) => v.url === url)) {
            document.servers.push({
              url,
            });
          }
          return document;
        },
      },
    );
  }
}
