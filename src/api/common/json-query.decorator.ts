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

import {
  ExecutionContext,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { Request } from 'express';
import { FilterDto } from './dto/filter.dto';
export const JsonQuery = createParamDecorator<string>(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (!data) return req.query;
    if (typeof req.query?.[data] !== 'string') return req.query?.[data];
    return JSON.parse(req.query?.[data] as string);
  },
);

export function ApiFilterJsonQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'filter',
      required: false,
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(FilterDto) },
        },
      },
    }),
  );
}

export function ApiWhereJsonQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'where',
      content: {
        'application/json': {
          schema: {
            type: 'object',
          },
        },
      },
    }),
  );
}
