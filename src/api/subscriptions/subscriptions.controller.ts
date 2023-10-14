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
  Patch,
  Post,
  Put,
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
import crypto from 'crypto';
import { Request, Response } from 'express';
import { merge } from 'lodash';
import { AnyObject, FilterQuery } from 'mongoose';
import RandExp from 'randexp';
import { Role } from 'src/auth/constants';
import { UserProfile } from 'src/auth/dto/user-profile.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AppConfigService } from 'src/config/app-config.service';
import { BaseController } from '../common/base.controller';
import { ApiWhereJsonQuery, JsonQuery } from '../common/json-query.decorator';
import { ConfigurationsService } from '../configurations/configurations.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
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

  @Get(':id/unsubscribe/undo')
  @ApiOperation({
    summary: 'revert anonymous unsubscription by id',
  })
  @ApiOkResponse({
    description: 'Request was successful',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiParam(SubscriptionsController.idParamSpec)
  @ApiQuery(SubscriptionsController.unsubscriptionCodeParamSpec)
  async unDeleteItemById(
    @Req() req: Request & { user: UserProfile },
    @Res() response: Response,
    @Param('id') id: string,
    @Query('unsubscriptionCode')
    unsubscriptionCode?: string,
  ): Promise<void> {
    const instance = await this.subscriptionsService.findOne({ where: { id } });
    if (!instance) throw new HttpException(undefined, HttpStatus.NOT_FOUND);
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );
    const anonymousUndoUnsubscription =
      mergedSubscriptionConfig.anonymousUndoUnsubscription;
    try {
      if (![Role.SuperAdmin, Role.Admin].includes(req.user.role)) {
        if (
          instance.unsubscriptionCode &&
          unsubscriptionCode !== instance.unsubscriptionCode
        ) {
          throw new HttpException(undefined, HttpStatus.FORBIDDEN);
        }
        if (
          req.user.role === Role.AuthenticatedUser ||
          instance.state !== 'deleted'
        ) {
          throw new HttpException(undefined, HttpStatus.FORBIDDEN);
        }
      }
      const revertItems = async (query: FilterQuery<Subscription>) => {
        await this.subscriptionsService.updateAll(
          {
            state: 'confirmed',
          },
          query,
          req,
        );
        response.setHeader('Content-Type', 'text/plain');
        if (anonymousUndoUnsubscription.redirectUrl) {
          let redirectUrl = anonymousUndoUnsubscription.redirectUrl;
          redirectUrl += `?channel=${instance.channel}`;
          return response.redirect(redirectUrl);
        } else {
          return response.end(anonymousUndoUnsubscription.successMessage);
        }
      };
      if (!instance.unsubscribedAdditionalServices) {
        await revertItems({
          id: instance.id,
        });
        return;
      }
      const unsubscribedAdditionalServicesIds =
        instance.unsubscribedAdditionalServices.ids.slice();
      delete instance.unsubscribedAdditionalServices;
      await this.subscriptionsService.replaceById(instance.id, instance, req);
      await revertItems({
        $or: [
          {
            id: {
              $in: unsubscribedAdditionalServicesIds,
            },
          },
          {
            id: instance.id,
          },
        ],
      });
    } catch (err: any) {
      response.setHeader('Content-Type', 'text/plain');
      if (anonymousUndoUnsubscription.redirectUrl) {
        let redirectUrl = anonymousUndoUnsubscription.redirectUrl;
        redirectUrl += `?channel=${instance.channel}`;
        redirectUrl += '&err=' + encodeURIComponent(err.message || err);
        return response.redirect(redirectUrl);
      } else {
        response.status(err.status || 500);
        response.end(anonymousUndoUnsubscription.failureMessage);
        return;
      }
    }
  }

  @Get(':id/unsubscribe')
  @ApiOperation({ summary: 'unsubscribe by id' })
  @ApiOkResponse({
    description: 'Request was successful',
  })
  @ApiResponse({
    status: 302,
    description: 'Request was successful. Redirect.',
  })
  @ApiParam(SubscriptionsController.idParamSpec)
  @ApiQuery(SubscriptionsController.additionalServicesParamSpec)
  @ApiQuery(SubscriptionsController.unsubscriptionCodeParamSpec)
  @ApiQuery(SubscriptionsController.userChannelIdParamSpec)
  async deleteByIdAlias(
    @Req() req: Request & { user: UserProfile },
    @Res() response: Response,
    @Param('id') id: string,
    @Query('unsubscriptionCode')
    unsubscriptionCode?: string,
    @Query('userChannelId')
    userChannelId?: string,
    @Query('additionalServices', ParseArrayPipe)
    additionalServices?: string[],
  ): Promise<void> {
    await this.deleteById(
      req,
      response,
      id,
      unsubscriptionCode,
      userChannelId,
      additionalServices,
    );
  }

  @Get(':id/verify')
  @ApiOperation({ summary: 'verify confirmation code' })
  @ApiOkResponse({
    description: 'Request was successful',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  @ApiParam(SubscriptionsController.idParamSpec)
  @ApiQuery({
    name: 'confirmationCode',
    description: 'confirmation code',
    required: true,
  })
  @ApiQuery({
    name: 'replace',
    description: 'whether or not replacing existing subscriptions',
    required: false,
  })
  async verify(
    @Req() req: Request & { user: UserProfile },
    @Res() response: Response,
    @Param('id') id: string,
    @Query('confirmationCode')
    confirmationCode: string,
    @Query('replace')
    replace?: boolean,
  ): Promise<void> {
    let instance = (await this.subscriptionsService.findOne({
      where: { id },
    })) as Subscription;
    if (!instance) throw new HttpException(undefined, HttpStatus.NOT_FOUND);
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      instance.serviceName,
    );

    const handleConfirmationAcknowledgement = async (
      err: any,
      message?: string,
    ) => {
      if (!mergedSubscriptionConfig.confirmationAcknowledgements) {
        if (err) {
          throw err;
        }
        return response.end(message);
      }
      let redirectUrl =
        mergedSubscriptionConfig.confirmationAcknowledgements.redirectUrl;
      response.setHeader('Content-Type', 'text/plain');
      if (redirectUrl) {
        redirectUrl += `?channel=${instance.channel}`;
        if (err) {
          redirectUrl += '&err=' + encodeURIComponent(err.toString());
        }
        return response.redirect(redirectUrl);
      } else {
        if (err) {
          if (err.status) {
            response.status(err.status);
          }
          return response.end(
            mergedSubscriptionConfig.confirmationAcknowledgements
              .failureMessage,
          );
        }
        return response.end(
          mergedSubscriptionConfig.confirmationAcknowledgements.successMessage,
        );
      }
    };

    if (
      (instance.state !== 'unconfirmed' && instance.state !== 'confirmed') ||
      (instance.confirmationRequest &&
        confirmationCode !== instance.confirmationRequest.confirmationCode)
    ) {
      await handleConfirmationAcknowledgement(
        new HttpException(undefined, HttpStatus.FORBIDDEN),
      );
      return;
    }
    try {
      if (replace && instance.userChannelId) {
        const whereClause: FilterQuery<Subscription> = {
          serviceName: instance.serviceName,
          state: 'confirmed',
          channel: instance.channel,
        };
        // email address check should be case insensitive
        const escapedUserChannelId = instance.userChannelId.replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g,
          '\\$&',
        );
        const escapedUserChannelIdRegExp = new RegExp(
          escapedUserChannelId,
          'i',
        );
        whereClause.userChannelId = {
          $regex: escapedUserChannelIdRegExp,
        };
        await this.subscriptionsService.updateAll(
          {
            state: 'deleted',
          },
          whereClause,
          req,
        );
      }
      await this.subscriptionsService.updateById(
        instance.id,
        {
          state: 'confirmed',
        },
        req,
      );
      instance = (await this.subscriptionsService.findOne({
        where: { id },
      })) as Subscription;
    } catch (err) {
      await handleConfirmationAcknowledgement(err);
      return;
    }
    await handleConfirmationAcknowledgement(null, 'OK');
    return;
  }

  @Roles(Role.SuperAdmin, Role.Admin)
  @Put(':id')
  @ApiOperation({ summary: 'replace a subscription' })
  @ApiOkResponse({
    description: 'Subscription model instance',
    type: Subscription,
  })
  async replaceById(
    @Req() req: Request & { user: UserProfile },
    @Param('id') id: string,
    @Body() subscription: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.replaceById(id, subscription, req);
  }

  @Roles(Role.SuperAdmin, Role.Admin, Role.AuthenticatedUser)
  @Patch(':id')
  @ApiOperation({ summary: 'update a subscription' })
  @ApiOkResponse({
    description: 'Subscription model instance',
    type: Subscription,
  })
  async updateById(
    @Req() req: Request & { user: UserProfile },
    @Param('id') id: string,
    @Body() subscription: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const instance = await this.subscriptionsService.findOne({ where: { id } });
    if (!instance) throw new HttpException(undefined, HttpStatus.NOT_FOUND);
    const filteredData = merge({}, instance);
    if (
      subscription.userChannelId &&
      filteredData.userChannelId !== subscription.userChannelId
    ) {
      filteredData.state = 'unconfirmed';
      filteredData.userChannelId = subscription.userChannelId;
    }
    if (subscription.data) {
      filteredData.data = subscription.data;
    }
    await this.beforeUpsert(req, filteredData);
    await this.subscriptionsService.updateById(id, filteredData, req);
    if (!filteredData.confirmationRequest) {
      return filteredData;
    }
    await this.handleConfirmationRequest(req, filteredData);
    return filteredData;
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

  private async handleConfirmationRequest(
    req: Request & { user: UserProfile },
    data: any,
  ) {
    if (
      data.state !== 'unconfirmed' ||
      !data.confirmationRequest?.sendRequest
    ) {
      return;
    }
    let textBody =
      data.confirmationRequest.textBody &&
      this.mailMerge(data.confirmationRequest.textBody, data, {}, req);
    let mailSubject =
      data.confirmationRequest.subject &&
      this.mailMerge(data.confirmationRequest.subject, data, {}, req);
    let mailHtmlBody =
      data.confirmationRequest.htmlBody &&
      this.mailMerge(data.confirmationRequest.htmlBody, data, {}, req);
    let mailFrom = data.confirmationRequest.from;

    // handle duplicated request
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      data.serviceName,
    );
    if (mergedSubscriptionConfig.detectDuplicatedSubscription) {
      const whereClause: any = {
        serviceName: data.serviceName,
        state: 'confirmed',
        channel: data.channel,
      };
      if (data.userChannelId) {
        // email address check should be case insensitive
        const escapedUserChannelId = data.userChannelId.replace(
          /[-[\]{}()*+?.,\\^$|#\s]/g,
          '\\$&',
        );
        const escapedUserChannelIdRegExp = new RegExp(
          escapedUserChannelId,
          'i',
        );
        whereClause.userChannelId = {
          $regex: escapedUserChannelIdRegExp,
        };
      }
      const subCnt = await this.count(req, whereClause);
      if (subCnt.count > 0) {
        mailFrom =
          mergedSubscriptionConfig.duplicatedSubscriptionNotification[
            data.channel
          ].from;
        textBody =
          mergedSubscriptionConfig.duplicatedSubscriptionNotification[
            data.channel
          ].textBody &&
          this.mailMerge(
            mergedSubscriptionConfig.duplicatedSubscriptionNotification[
              data.channel
            ].textBody,
            data,
            {},
            req,
          );
        mailSubject =
          mergedSubscriptionConfig.duplicatedSubscriptionNotification.email
            .subject &&
          this.mailMerge(
            mergedSubscriptionConfig.duplicatedSubscriptionNotification.email
              .subject,
            data,
            {},
            req,
          );
        mailHtmlBody =
          mergedSubscriptionConfig.duplicatedSubscriptionNotification.email
            .htmlBody &&
          this.mailMerge(
            mergedSubscriptionConfig.duplicatedSubscriptionNotification.email
              .htmlBody,
            data,
            {},
            req,
          );
      }
    }
    switch (data.channel) {
      case 'sms':
        await this.sendSMS(data.userChannelId, textBody, data);
        break;
      default: {
        const mailOptions = {
          from: mailFrom,
          to: data.userChannelId,
          subject: mailSubject,
          text: textBody,
          html: mailHtmlBody,
        };
        await this.sendEmail(mailOptions);
      }
    }
  }

  private async beforeUpsert(
    req: Request & { user: UserProfile },
    data: Subscription,
  ) {
    const mergedSubscriptionConfig = await this.getMergedConfig(
      'subscription',
      data.serviceName,
    );
    const userId =
      req.user?.role === Role.AuthenticatedUser
        ? req.user.securityId
        : undefined;
    if (userId) {
      data.userId = userId;
    } else if (
      ![Role.Admin, Role.SuperAdmin].includes(req.user?.role) ||
      !data.unsubscriptionCode
    ) {
      // generate unsubscription code
      const anonymousUnsubscription =
        mergedSubscriptionConfig.anonymousUnsubscription;
      if (anonymousUnsubscription.code?.required) {
        const unsubscriptionCodeRegex = new RegExp(
          anonymousUnsubscription.code.regex,
        );
        data.unsubscriptionCode = new RandExp(unsubscriptionCodeRegex).gen();
      }
    }
    if (data.confirmationRequest?.confirmationCodeEncrypted) {
      const rsaConfig = await this.configurationsService.findOne({
        where: {
          name: 'rsa',
        },
      });
      const decrypted = crypto
        .privateDecrypt(
          {
            key: rsaConfig.value.private,
          },
          Buffer.from(
            data.confirmationRequest.confirmationCodeEncrypted,
            'base64',
          ),
        )
        .toString('utf8');
      const decryptedData = decrypted.split(' ');
      data.userChannelId = decryptedData[0];
      data.confirmationRequest.confirmationCode = decryptedData[1];
      return;
    }
    // use request without encrypted payload
    if (
      ![Role.Admin, Role.SuperAdmin].includes(req.user?.role) ||
      !data.confirmationRequest
    ) {
      try {
        data.confirmationRequest =
          mergedSubscriptionConfig.confirmationRequest[data.channel];
      } catch (ex) {}
      data.confirmationRequest &&
        (data.confirmationRequest.confirmationCode = undefined);
    }
    if (!data.confirmationRequest) {
      return;
    }
    if (
      !data.confirmationRequest.confirmationCode &&
      data.confirmationRequest.confirmationCodeRegex
    ) {
      const confirmationCodeRegex = new RegExp(
        data.confirmationRequest.confirmationCodeRegex,
      );
      data.confirmationRequest.confirmationCode = new RandExp(
        confirmationCodeRegex,
      ).gen();
    }
    return;
  }
}
