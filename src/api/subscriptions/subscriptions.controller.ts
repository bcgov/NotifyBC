import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AnyObject, FilterQuery } from 'mongoose';
import { Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AppConfigService } from 'src/config/app-config.service';
import { BaseController } from '../common/base.controller';
import { ApiWhereJsonQuery, JsonQuery } from '../common/json-query.decorator';
import { ConfigurationsService } from '../configurations/configurations.service';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionAfterRemoteInterceptor } from './subscription-after-remote.interceptor';
import { SubscriptionsQueryTransformPipe } from './subscriptions-query-transform.pipe';
import { SubscriptionsService } from './subscriptions.service';
// todo: apply SubscriptionsQueryTransformPipe for find, findOne, updateAll, deleteAll

@Controller('subscriptions')
@ApiTags('subscription')
@UseInterceptors(SubscriptionAfterRemoteInterceptor)
export class SubscriptionsController extends BaseController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    readonly appConfigService: AppConfigService,
    readonly configurationsService: ConfigurationsService,
  ) {
    super(appConfigService, configurationsService);
  }

  @Get('count')
  @ApiOperation({
    summary: 'count subscriptions',
  })
  @ApiWhereJsonQuery()
  @Roles(Role.SuperAdmin, Role.Admin, Role.AuthenticatedUser)
  async count(
    @Req() req,
    @JsonQuery('where', SubscriptionsQueryTransformPipe)
    where?: FilterQuery<Subscription>,
  ) {
    return this.subscriptionsService.count(where);
  }

  @Roles(Role.SuperAdmin, Role.Admin, Role.AuthenticatedUser)
  @ApiOperation({
    summary: 'unique list of subscribed service names',
  })
  @Get('services')
  @ApiForbiddenResponse({ description: 'Forbidden' })
  getSubscribedServiceNames(): Promise<string[]> {
    return this.subscriptionsService.distinct('serviceName', {
      state: 'confirmed',
    });
  }

  @Post('swift')
  @ApiOperation({
    summary: 'handle unsubscription from Swift keyword redirect',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiOkResponse({
    description: 'Request was successful',
  })
  @HttpCode(200)
  async handleSwiftUnsubscription(
    @Req() req: Request & { user: UserProfile },
    @Res() response: Response,
    @Body()
    body: AnyObject,
  ): Promise<void> {
    /*
    sample swift post
    { PhoneNumber: '1250nnnnnnn',
      ReceivedDate: '2020-05-11 19:56:52',
      MessageBody: '<case insensitive keyword>',
      Destination: '79438',
      AccountKey: 'xxx',
      Reference: '5eb9e53ac8de837a99fd214a',
      OutgoingMessageID: '789091964',
      MessageNumber: '59255257',
      notifyBCSwiftKey: '1111'
    }
    */
    if (this.appConfigService.get('sms.provider') !== 'swift') {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    const smsConfig = this.appConfigService.get('sms.providerSettings');
    if (!smsConfig?.swift?.notifyBCSwiftKey) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    if (smsConfig.swift.notifyBCSwiftKey !== body.notifyBCSwiftKey) {
      throw new HttpException(undefined, HttpStatus.FORBIDDEN);
    }
    const where: FilterQuery<Subscription> = {
      state: 'confirmed',
      channel: 'sms',
    };
    if (body.Reference) {
      where.id = body.Reference;
    } else {
      if (!body.PhoneNumber) {
        throw new HttpException(undefined, HttpStatus.FORBIDDEN);
      }
      const phoneNumberArr = body.PhoneNumber.split('');
      // country code is optional
      if (phoneNumberArr[0] === '1') {
        phoneNumberArr[0] = '1?';
      }
      const phoneNumberRegex = new RegExp(phoneNumberArr.join('-?'));
      where.userChannelId = phoneNumberRegex;
    }
    const subscription = await this.subscriptionsService.findOne({
      where,
    });
    if (!subscription) {
      response.send('ok');
      return;
    }
    await this.deleteById(
      req,
      response,
      subscription.id as string,
      subscription.unsubscriptionCode,
    );
  }

  static readonly additionalServicesParamSpec: ApiQueryOptions = {
    name: 'additionalServices',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
    description:
      'additional services to unsubscribe. If there is only one item and the value is _all, then unsubscribe all subscribed services.',
  };
  static readonly idParamSpec: ApiParamOptions = {
    name: 'id',
    description: 'subscription id',
  };
  static readonly unsubscriptionCodeParamSpec: ApiParamOptions = {
    name: 'unsubscriptionCode',
    description:
      'unsubscription code, may be required for unauthenticated user request',
  };
  static readonly userChannelIdParamSpec: ApiParamOptions = {
    name: 'userChannelId',
    description:
      'optional. Used in validation along with unsubscriptionCode if populated.',
  };
  @Delete(':id')
  @ApiOperation({ summary: 'unsubscribe by id' })
  @ApiParam(SubscriptionsController.idParamSpec)
  @ApiQuery(SubscriptionsController.additionalServicesParamSpec)
  @ApiQuery(SubscriptionsController.unsubscriptionCodeParamSpec)
  @ApiQuery(SubscriptionsController.userChannelIdParamSpec)
  @ApiOkResponse({
    description: 'Request was successful',
  })
  @ApiResponse({
    status: 302,
    description: 'Request was successful. Redirect.',
  })
  async deleteById(
    @Req() req: Request & { user: UserProfile },
    @Res() response: Response,
    @Param('id') id: string,
    @Query('unsubscriptionCode')
    unsubscriptionCode: string,
    @Query('userChannelId')
    userChannelId?: string,
    @Query('additionalServices', ParseArrayPipe)
    additionalServices?: string[],
  ): Promise<void> {
    let instance = await this.subscriptionsService.findOne({
      where: { id },
    });
    if (!instance) throw new HttpException(undefined, HttpStatus.NOT_FOUND);
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );
    const anonymousUnsubscription =
      mergedSubscriptionConfig.anonymousUnsubscription;
    try {
      let forbidden = false;
      if (![Role.Admin, Role.SuperAdmin].includes(req.user?.role)) {
        if (req.user?.role === Role.AuthenticatedUser) {
          if (req.user.securityId !== instance.userId) {
            forbidden = true;
          }
        } else {
          if (
            instance.unsubscriptionCode &&
            unsubscriptionCode !== instance.unsubscriptionCode
          ) {
            forbidden = true;
          }
          try {
            if (
              userChannelId &&
              instance.userChannelId.toLowerCase() !==
                userChannelId.toLowerCase()
            ) {
              forbidden = true;
            }
          } catch (ex) {}
        }
      }
      if (instance.state !== 'confirmed') {
        forbidden = true;
      }
      if (forbidden) {
        throw new HttpException(undefined, HttpStatus.FORBIDDEN);
      }
      const unsubscribeItems = async (
        query: FilterQuery<Subscription>,
        addtServices?: string | AdditionalServices,
      ) => {
        await this.subscriptionsService.updateAll(
          {
            state: 'deleted',
          },
          query,
          req,
        );
        const handleUnsubscriptionResponse = async () => {
          // send acknowledgement notification
          try {
            const msg =
              anonymousUnsubscription.acknowledgements.notification[
                instance.channel
              ];
            let textBody;
            switch (instance.channel) {
              case 'sms':
                textBody = this.mailMerge(msg.textBody, instance, {}, req);
                await this.sendSMS(instance.userChannelId, textBody, instance);
                break;
              case 'email': {
                const subject = this.mailMerge(msg.subject, instance, {}, req);
                textBody = this.mailMerge(msg.textBody, instance, {}, req);
                const htmlBody = this.mailMerge(
                  msg.htmlBody,
                  instance,
                  {},
                  req,
                );
                const mailOptions = {
                  from: msg.from,
                  to: instance.userChannelId,
                  subject: subject,
                  text: textBody,
                  html: htmlBody,
                };
                await this.sendEmail(mailOptions);
                break;
              }
            }
          } catch (ex) {}
          response.setHeader('Content-Type', 'text/plain');
          if (anonymousUnsubscription.acknowledgements.onScreen.redirectUrl) {
            let redirectUrl =
              anonymousUnsubscription.acknowledgements.onScreen.redirectUrl;
            redirectUrl += `?channel=${instance.channel}`;
            return response.redirect(redirectUrl);
          } else {
            return response.end(
              anonymousUnsubscription.acknowledgements.onScreen.successMessage,
            );
          }
        };
        if (!addtServices) {
          return handleUnsubscriptionResponse();
        }
        await this.subscriptionsService.updateById(
          id,
          {
            unsubscribedAdditionalServices: addtServices,
          },
          undefined,
        );
        instance = (await this.subscriptionsService.findOne({
          where: { id },
        })) as Subscription;
        if (!instance) throw new HttpException(undefined, HttpStatus.NOT_FOUND);
        await handleUnsubscriptionResponse();
      };
      if (!additionalServices) {
        await unsubscribeItems({
          id: id,
        });
        return;
      }
      interface AdditionalServices {
        names: string[];
        ids: string[];
      }
      const getAdditionalServiceIds = async (): Promise<AdditionalServices> => {
        if (additionalServices.length > 1) {
          const res = await this.subscriptionsService.findAll({
            fields: { id: true, serviceName: true },
            where: {
              serviceName: {
                $in: additionalServices,
              },
              channel: instance.channel,
              userChannelId: instance.userChannelId,
            },
          });
          return {
            names: res.map((e) => e.serviceName),
            ids: res.map((e) => e.id) as string[],
          };
        }
        if (additionalServices.length === 1) {
          if (additionalServices[0] !== '_all') {
            const res = await this.subscriptionsService.findAll({
              fields: { id: true, serviceName: true },
              where: {
                serviceName: additionalServices[0],
                channel: instance.channel,
                userChannelId: instance.userChannelId,
              },
            });
            return {
              names: res.map((e) => e.serviceName),
              ids: res.map((e) => e.id) as string[],
            };
          }
          // get all subscribed services
          const res = await this.subscriptionsService.findAll({
            fields: { id: true, serviceName: true },
            where: {
              userChannelId: instance.userChannelId,
              channel: instance.channel,
              state: 'confirmed',
            },
          });
          return {
            names: res.map((e) => e.serviceName),
            ids: res.map((e) => e.id) as string[],
          };
        }
        throw new HttpException(undefined, HttpStatus.INTERNAL_SERVER_ERROR);
      };
      const data = await getAdditionalServiceIds();
      await unsubscribeItems(
        {
          id: {
            $in: ([] as string[]).concat(id, data.ids),
          },
        },
        data,
      );
    } catch (error: any) {
      response.setHeader('Content-Type', 'text/plain');
      if (anonymousUnsubscription.acknowledgements.onScreen.redirectUrl) {
        let redirectUrl =
          anonymousUnsubscription.acknowledgements.onScreen.redirectUrl;
        redirectUrl += `?channel=${instance.channel}`;
        redirectUrl += '&err=' + encodeURIComponent(error);
        return response.redirect(redirectUrl);
      } else {
        if (anonymousUnsubscription.acknowledgements.onScreen.failureMessage) {
          response.status(error.status || 500);
          response.end(
            anonymousUnsubscription.acknowledgements.onScreen.failureMessage,
          );
          return;
        } else {
          throw error;
        }
      }
    }
  }

  // @Post()
  // create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
  //   return this.subscriptionsService.create(createSubscriptionDto);
  // }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.subscriptionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  // ) {
  //   return this.subscriptionsService.update(+id, updateSubscriptionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subscriptionsService.remove(+id);
  // }
}
