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
const debug = debugModule('notifyBC:security-spec-enhancer');

export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};

export const OPERATION_SECURITY_SPEC = [
  {
    accessToken: [],
    oidc: [],
  },
];

export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  accessToken: {
    type: 'apiKey',
    in: 'header',
    name: 'Authorization',
  },
  oidc: {
    type: 'oauth2',
    flows: {
      implicit: {
        authorizationUrl:
          'https://dev.oidc.gov.bc.ca/auth/realms/gde0rjxl/protocol/openid-connect/auth',
        scopes: {oidc: 'oidc'},
      },
    },
    // openIdConnectUrl:
    //   'https://dev.oidc.gov.bc.ca/auth/realms/gde0rjxl/.well-known/openid-configuration',
  },
};

/**
 * A spec enhancer to add bearer token OpenAPI security entry to
 * `spec.component.securitySchemes`
 */
@injectable(asSpecEnhancer)
export class SecuritySpecEnhancer implements OASEnhancer {
  name = 'apiKeyAuth';

  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    const patchSpec = {
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      security: OPERATION_SECURITY_SPEC,
    };
    const mergedSpec = mergeOpenAPISpec(spec, patchSpec);
    debug(`security spec extension, merged spec: ${inspect(mergedSpec)}`);
    return mergedSpec;
  }
}
