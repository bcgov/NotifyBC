import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
export const JsonQuery = createParamDecorator<string>(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    if (!data) return req.query;
    if (typeof req.query?.[data] !== 'string') return req.query?.[data];
    return JSON.parse(req.query?.[data] as string);
  },
);
