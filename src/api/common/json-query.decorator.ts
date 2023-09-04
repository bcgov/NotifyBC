import {
  ExecutionContext,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { Request } from 'express';
import { LoopbackFilterDto } from './dto/loopback-filter.dto';
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
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(LoopbackFilterDto) },
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
