import {CoreBindings, inject, intercept} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  MiddlewareContext,
  oas,
  param,
  patch,
  post,
  put,
  requestBody,
  RestBindings,
} from '@loopback/rest';
import {ApplicationConfig} from '..';
import {AuthenticatedOrAdminInterceptor} from '../interceptors';
import {Notification} from '../models';
import {ConfigurationRepository, NotificationRepository} from '../repositories';
import {BaseController} from './base.controller';

@intercept(AuthenticatedOrAdminInterceptor.BINDING_KEY)
@oas.tags('notification')
export class NotificationController extends BaseController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    @inject(CoreBindings.APPLICATION_CONFIG)
    appConfig: ApplicationConfig,
    @repository(ConfigurationRepository)
    public configurationRepository: ConfigurationRepository,
    @inject(RestBindings.Http.CONTEXT)
    private httpContext: MiddlewareContext,
  ) {
    super(appConfig, configurationRepository);
  }

  @post('/notifications', {
    responses: {
      '200': {
        description: 'Notification model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Notification)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {
            title: 'NewNotification',
            exclude: ['id'],
          }),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    return this.notificationRepository.create(notification);
  }

  @get('/notifications/count', {
    responses: {
      '200': {
        description: 'Notification model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Notification) where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.count(where);
  }

  @get('/notifications', {
    responses: {
      '200': {
        description: 'Array of Notification model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Notification, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Notification) filter?: Filter<Notification>,
  ): Promise<Notification[]> {
    const res = await this.notificationRepository.find(filter);
    if (res.length === 0) {
      return res;
    }
    const currUser = this.configurationRepository.getCurrentUser(
      this.httpContext,
    );
    if (!currUser) {
      return res;
    }
    return res.reduce((p: Notification[], e) => {
      if (e.validTill && Date.parse(e.validTill) < new Date().valueOf()) {
        return p;
      }
      if (
        e.invalidBefore &&
        Date.parse(e.invalidBefore) > new Date().valueOf()
      ) {
        return p;
      }
      if (e.deletedBy && e.deletedBy.indexOf(currUser) >= 0) {
        return p;
      }
      if (e.isBroadcast && e.readBy && e.readBy.indexOf(currUser) >= 0) {
        e.state = 'read';
      }
      if (e.isBroadcast) {
        e.readBy = null;
        e.deletedBy = null;
      }
      delete e.updatedBy;
      delete e.createdBy;
      p.push(e);
      return p;
    }, []);
  }

  @get('/notifications/{id}', {
    responses: {
      '200': {
        description: 'Notification model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Notification, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Notification, {exclude: 'where'})
    filter?: FilterExcludingWhere<Notification>,
  ): Promise<Notification> {
    return this.notificationRepository.findById(id, filter);
  }

  @patch('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.updateById(id, notification);
  }

  @put('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.replaceById(id, notification);
  }

  @del('/notifications/{id}', {
    responses: {
      '204': {
        description: 'Notification DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.notificationRepository.deleteById(id);
  }
}
