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
  },
];

export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  accessToken: {
    type: 'apiKey',
    in: 'header',
    name: 'Authorization',
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
