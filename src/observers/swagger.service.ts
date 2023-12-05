// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Injectable, OnModuleInit } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { FilterDto } from 'src/api/common/dto/filter.dto';
import { AppConfigService } from 'src/config/app-config.service';
import { AppService } from '../app.service';
import { OidcDiscoveryService } from '../config/oidc-discovery.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
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
