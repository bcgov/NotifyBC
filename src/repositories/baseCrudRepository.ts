import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  Entity,
  juggler,
  Model,
} from '@loopback/repository';
import {MiddlewareBindings, MiddlewareContext} from '@loopback/rest';

export class BaseCrudRepository<
  T extends Entity,
  ID,
  Relations extends object = {}
> extends DefaultCrudRepository<T, ID, Relations> {
  constructor(
    entityClass: typeof Entity & {
      prototype: T;
    },
    dataSource: juggler.DataSource,
    @inject.getter(MiddlewareBindings.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
  ) {
    super(entityClass, dataSource);
  }

  protected definePersistedModel(
    entityClass: typeof Model,
  ): typeof juggler.PersistedModel {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      let req;
      try {
        const httpCtx = await this.getHttpContext();
        req = httpCtx.request;
      } catch (ex) {}
      let token;
      try {
        // todo: obtain access token
        token =
          ctx.options.httpContext.args.options &&
          ctx.options.httpContext.args.options.accessToken;
      } catch (ex) {}
      try {
        if (ctx.instance) {
          ctx.instance.updated = new Date();
          ctx.instance.updatedBy = {
            ip: req && req.ip,
            eventSrc: ctx.options.eventSrc,
          };
          if (token && token.userId) {
            ctx.instance.updatedBy.adminUser = token.userId;
          }
          if (ctx.isNewInstance) {
            ctx.instance.createdBy = {
              ip: req && req.ip,
            };
            if (token && token.userId) {
              ctx.instance.createdBy.adminUser = token.userId;
            }
          }
        } else if (ctx.data) {
          ctx.data.updated = new Date();
          ctx.data.updatedBy = {
            ip: req && req.ip,
            eventSrc: ctx.options.eventSrc,
          };
          if (token && token.userId) {
            ctx.data.updatedBy.adminUser = token.userId;
          }
          if (ctx.isNewInstance) {
            ctx.data.createdBy = {
              ip: req && req.ip,
            };
            if (token && token.userId) {
              ctx.data.createdBy.adminUser = token.userId;
            }
          }
        }
      } catch (ex) {}
    });
    return modelClass;
  }
}
