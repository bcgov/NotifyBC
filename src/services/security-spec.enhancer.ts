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

import {injectable} from '@loopback/core';
import {
  asSpecEnhancer,
  mergeOpenAPISpec,
  OASEnhancer,
  OpenApiSpec,
  ReferenceObject,
  SecuritySchemeObject,
} from '@loopback/rest';
import debugModule from 'debug';
import {inspect} from 'util';
import {OidcDiscoveryObserver} from '../observers';
const debug = debugModule('notifyBC:security-spec-enhancer');

export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};

/**
 * A spec enhancer to add bearer token OpenAPI security entry to
 * `spec.component.securitySchemes`
 */
@injectable(asSpecEnhancer)
export class SecuritySpecEnhancer implements OASEnhancer {
  name = 'authn';

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    const securitySchemeSpec: SecuritySchemeObjects = {
      accessToken: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    };
    const operationSecuritySpec: any[] = [
      {
        accessToken: [],
      },
    ];

    if (OidcDiscoveryObserver.authorizationUrl) {
      securitySchemeSpec.oidc = {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: OidcDiscoveryObserver.authorizationUrl,
            scopes: {},
          },
        },
      };
      operationSecuritySpec[0].oidc = [];
    }

    const info = Object.assign({}, spec.info, {title: 'NotifyBC'});
    const patchSpec = {
      info,
      components: {
        securitySchemes: securitySchemeSpec,
      },
      security: operationSecuritySpec,
    };
    const mergedSpec = mergeOpenAPISpec(spec, patchSpec);
    debug(`security spec extension, merged spec: ${inspect(mergedSpec)}`);
    return mergedSpec;
  }
}
