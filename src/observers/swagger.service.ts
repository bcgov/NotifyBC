import { Injectable, OnModuleInit } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { FilterDto } from 'src/api/common/dto/filter.dto';
import { AppConfigService } from 'src/config/app-config.service';
import { AppService } from '../app.service';
import { OidcDiscoveryService } from '../config/oidc-discovery.service';
const packageJson = require('../../package.json');

@Injectable()
export class SwaggerService implements OnModuleInit {
  readonly appConfig;
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly oidcDiscoveryService: OidcDiscoveryService,
  ) {
    this.appConfig = appConfigService.get();
  }

  onModuleInit() {
    const documentBuilder = new DocumentBuilder()
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
      .addSecurityRequirements('accessToken');
    if (this.oidcDiscoveryService.authorizationUrl) {
      documentBuilder
        .addSecurity('oidc', {
          type: 'oauth2',
          flows: {
            implicit: {
              authorizationUrl: this.oidcDiscoveryService.authorizationUrl,
              scopes: {},
            },
          },
        })
        .addSecurityRequirements('oidc');
    }
    const swaggerConfig = documentBuilder.build();
    const document = SwaggerModule.createDocument(
      AppService.app,
      swaggerConfig,
      {
        extraModels: [FilterDto],
      },
    );
    SwaggerModule.setup('explorer', AppService.app, document, {
      useGlobalPrefix: true,
      customJs: '/iframeResizer.contentWindow.min.js',
      patchDocumentOnRequest(req: any, _res: unknown, document: OpenAPIObject) {
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
    });
  }
}
