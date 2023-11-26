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

// start: ported
import {CoreBindings} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {Client, expect} from '@loopback/testlab';
import _ from 'lodash';
import sinon from 'sinon';
import {NotifyBcApplication} from '../..';
import {BaseController} from '../../controllers/base.controller';
import {Subscription} from '../../models';
import {
  ConfigurationRepository,
  SubscriptionRepository,
} from '../../repositories';
import {BaseCrudRepository} from '../../repositories/baseCrudRepository';
import {setupApplication} from './test-helper';

let app: NotifyBcApplication;
let subscriptionRepository: SubscriptionRepository;
let configurationRepository: ConfigurationRepository;
let client: Client;
before('setupApplication', async function () {
  ({app, client} = await setupApplication());
  subscriptionRepository = await app.get('repositories.SubscriptionRepository');
  configurationRepository = await app.get(
    'repositories.ConfigurationRepository',
  );
});

describe('GET /subscriptions', function () {
  beforeEach(async function () {
    await subscriptionRepository.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@foo.com',
      state: 'confirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in this email',
        confirmationCode: '37688',
      },
      unsubscriptionCode: '50032',
    });
  });

  it('should be forbidden by anonymous user', async function () {
    const res = await client.get('/api/subscriptions');
    expect(res.status).equal(401);
  });

  it("should return sm user's own subscription", async function () {
    const res = await client
      .get('/api/subscriptions')
      .set('Accept', 'application/json')
      .set('SM_USER', 'baz');
    expect(res.status).equal(200);
    expect(res.body.length).equal(0);
  });

  it('should have confirmationRequest field removed for sm user requests', async function () {
    const res = await client
      .get('/api/subscriptions')
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).equal(200);
    expect(res.body.length).equal(1);
    expect(res.body[0].confirmationRequest).undefined();
  });

  it('should be allowed by admin users', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => true);
    const res = await client.get('/api/subscriptions');
    expect(res.status).equal(200);
    expect(res.body.length).equal(1);
    expect(res.body[0].confirmationRequest).not.undefined();
  });
});

describe('POST /subscriptions', function () {
  it('should allow admin users create subscriptions without sending confirmation request', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => {
        return true;
      });
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@foo.com',
        state: 'confirmed',
        confirmationRequest: {
          sendRequest: false,
        },
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.notCalled(
      BaseController.prototype.sendEmail as sinon.SinonStub,
    );
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        userChannelId: 'bar@foo.com',
      },
    });
    expect(data[0].state).equal('confirmed');
  });

  it('should allow admin users create subscriptions and send confirmation request with proper mail merge', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => {
        return true;
      });
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'foo@bar.com',
        unsubscriptionCode: '54321',
        confirmationRequest: {
          from: 'a@b.com',
          subject: 'subject',
          sendRequest: true,
          textBody:
            '{subscription_confirmation_code} {service_name} {http_host} {rest_api_root} {subscription_id} {unsubscription_code} {unsubscription_url} {subscription_confirmation_url} {unsubscription_reversion_url}',
          confirmationCode: '12345',
        },
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.called(BaseController.prototype.sendEmail as sinon.SinonStub);
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{subscription_confirmation_code}')),
    );
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{service_name}')),
    );
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{http_host}')),
    );
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{rest_api_root}')),
    );
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{subscription_id}')),
    );
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{unsubscription_code}')),
    );
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{unsubscription_url}')),
    );
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{subscription_confirmation_url}')),
    );
    sinon.assert.neverCalledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('{unsubscription_reversion_url}')),
    );

    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('12345')),
    );
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('myService')),
    );
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('http://127.0.0.1')),
    );
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('/api')),
    );
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('1 ')),
    );
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('54321')),
    );
    //unsubscription_url
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has(
        'text',
        sinon.match(
          '/api/subscriptions/1/unsubscribe?unsubscriptionCode=54321',
        ),
      ),
    );
    //subscription_confirmation_url
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has(
        'text',
        sinon.match('/api/subscriptions/1/verify?confirmationCode=12345'),
      ),
    );
    //unsubscription_reversion_url
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has(
        'text',
        sinon.match(
          '/api/subscriptions/1/unsubscribe/undo?unsubscriptionCode=54321',
        ),
      ),
    );

    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        userChannelId: 'foo@bar.com',
      },
    });
    expect(data.length).equal(1);
  });

  it('should generate unsubscription code for subscriptions created by admin user', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => {
        return true;
      });
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'sms',
        userChannelId: '12345',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.calledOnce(
      BaseController.prototype.sendSMS as sinon.SinonStub,
    );
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        userChannelId: '12345',
      },
    });
    expect(data[0].unsubscriptionCode).match(/\d{5}/);
  });

  it('should generate unsubscription code for subscriptions created by admin user with confirmationRequest field populated', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => {
        return true;
      });
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'foo@bar.com',
        confirmationRequest: {
          from: 'foo@invalid.local',
          subject: 'subject',
          sendRequest: true,
          textBody:
            '{subscription_confirmation_code} {service_name} {http_host} {rest_api_root} {subscription_id} {unsubscription_code} {unsubscription_url} {subscription_confirmation_url} {unsubscription_reversion_url}',
          confirmationCodeRegex: '12345',
        },
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.calledOnce(
      BaseController.prototype.sendEmail as sinon.SinonStub,
    );
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        userChannelId: 'foo@bar.com',
      },
    });
    expect(data?.[0]?.confirmationRequest?.confirmationCode).equal('12345');
  });

  it('should allow non-admin user create sms subscription using swift provider', async function () {
    (BaseController.prototype.sendSMS as sinon.SinonStub).restore();
    sinon.stub(BaseController.prototype, 'sendSMS').callThrough();
    const fetchStub = sinon.stub(global, 'fetch');
    fetchStub.callsFake(async () => {
      return new Response();
    });
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'sms',
        userChannelId: '12345',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.calledOnce(
      BaseController.prototype.sendSMS as sinon.SinonStub,
    );
    sinon.assert.calledWith(
      fetchStub,
      'https://secure.smsgateway.ca/services/message.svc/123/12345',
    );
    expect(
      JSON.parse((fetchStub.getCall(0).args[1] as any).body)['MessageBody'],
    ).match(/Enter \d{5} on screen/);
    fetchStub.restore();
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        userChannelId: '12345',
      },
    });
    expect(data[0].unsubscriptionCode).match(/\d{5}/);
  });

  it('should ignore message supplied by non-admin user when creating a subscription', async function () {
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'nobody@invalid.local',
        confirmationRequest: {
          confirmationCodeRegex: '\\d{5}',
          sendRequest: true,
          from: 'nobody@invalid.local',
          subject: 'spoofed subject',
          textBody: 'spoofed body',
          confirmationCode: '41488',
        },
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.calledOnce(
      BaseController.prototype.sendEmail as sinon.SinonStub,
    );
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        userChannelId: 'nobody@invalid.local',
      },
    });
    expect(data[0].confirmationRequest?.textBody).not.match('spoofed');
    expect(
      (BaseController.prototype.sendEmail as sinon.SinonStub).getCall(0)
        .firstArg.subject,
    ).not.match('spoofed');
  });

  it('should reject subscriptions with invalid string broadcastPushNotificationFilter', async function () {
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'sms',
        userChannelId: '12345',
        broadcastPushNotificationFilter: "a === 'b'",
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(400);
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        userChannelId: '12345',
      },
    });
    expect(data.length).equal(0);
  });

  it('should accept subscriptions with valid broadcastPushNotificationFilter', async function () {
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'sms',
        userChannelId: '12345',
        broadcastPushNotificationFilter: "a == 'b'",
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.calledOnce(
      BaseController.prototype.sendSMS as sinon.SinonStub,
    );
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        userChannelId: '12345',
      },
    });
    expect(data[0].unsubscriptionCode).match(/\d{5}/);
  });

  it('should detect duplicated subscription', async function () {
    sinon
      .stub(BaseController.prototype, 'getMergedConfig')
      .callsFake(async function (...args) {
        const res = {
          detectDuplicatedSubscription: true,
          duplicatedSubscriptionNotification: {
            email: {
              from: 'no_reply@invalid.local',
              subject: 'Duplicated Subscription',
              textBody:
                'A duplicated subscription was submitted and rejected. you will continue receiving notifications. If the request was not created by you, please ignore this message.',
            },
          },
          confirmationRequest: {
            email: {
              confirmationCodeRegex: '\\d{5}',
              sendRequest: true,
              from: 'no_reply@invalid.local',
              subject: 'Subscription confirmation',
              textBody: 'Enter {subscription_confirmation_code} on screen',
            },
          },
          anonymousUnsubscription: {
            code: {
              required: true,
              regex: '\\d{5}',
            },
          },
        };
        const cb = args[args.length - 1];
        if (typeof cb === 'function') {
          return process.nextTick(cb, null, res);
        } else {
          return res;
        }
      });

    await subscriptionRepository.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@invalid.local',
      state: 'confirmed',
    });
    const res = await client
      .post('/api/subscriptions')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userChannelId: 'bar@invalid.local',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    sinon.assert.called(BaseController.prototype.sendEmail as sinon.SinonStub);
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has('text', sinon.match('A duplicated subscription')),
    );
    const data = await subscriptionRepository.find({
      where: {
        serviceName: 'myService',
        channel: 'email',
        state: 'unconfirmed',
        userChannelId: 'bar@invalid.local',
      },
    });
    expect(data.length).equal(1);
  });
});

describe('PATCH /subscriptions/{id}', function () {
  beforeEach(async function () {
    await subscriptionRepository.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@foo.com',
      state: 'confirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in this email',
        confirmationCode: '37688',
      },
      unsubscriptionCode: '50032',
    });
  });
  it('should allow sm users change their user channel id', async function () {
    const res = await client
      .patch('/api/subscriptions/1')
      .send({
        userChannelId: 'baz@foo.com',
      })
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.body.state).equal('unconfirmed');
    expect(res.body.userChannelId).equal('baz@foo.com');
  });
  it("should deny sm user from changing other user's subscription", async function () {
    const res = await client
      .patch('/api/subscriptions/1')
      .send({
        userChannelId: 'baz@foo.com',
      })
      .set('Accept', 'application/json')
      .set('SM_USER', 'baz');
    expect(res.status).equal(404);
  });
  it("should deny anonymous user's access", async function () {
    const res = await client
      .patch('/api/subscriptions/1')
      .send({
        userChannelId: 'baz@foo.com',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(401);
  });
});

describe('GET /subscriptions/{id}/verify', function () {
  let data: Subscription[];
  beforeEach(async function () {
    data = await Promise.all([
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userId: 'bar',
          userChannelId: 'bar@foo.com',
          state: 'unconfirmed',
          confirmationRequest: {
            confirmationCode: '37688',
          },
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'unconfirmed',
          confirmationRequest: {
            confirmationCode: '37689',
          },
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
        });
      })(),
    ]);
  });

  it('should verify confirmation code sent by sm user', async function () {
    let res: any = await client
      .get(
        '/api/subscriptions/' + data[0].id + '/verify?confirmationCode=37688',
      )
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).equal(200);
    res = await subscriptionRepository.findById(data[0].id);
    expect(res.state).equal('confirmed');
  });

  it('should verify confirmation code sent by anonymous user', async function () {
    let res: any = await client.get(
      '/api/subscriptions/' + data[1].id + '/verify?confirmationCode=37689',
    );
    expect(res.status).equal(200);
    res = await subscriptionRepository.findById(data[1].id);
    expect(res.state).equal('confirmed');
  });

  it('should deny incorrect confirmation code', async function () {
    let res: any = await client.get(
      '/api/subscriptions/' + data[1].id + '/verify?confirmationCode=0000',
    );
    expect(res.status).equal(403);
    res = await subscriptionRepository.findById(data[1].id);
    expect(res.state).equal('unconfirmed');
  });

  it('should unsubscribe existing subscriptions when replace paramter is supplied', async function () {
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[1].id +
        '/verify?confirmationCode=37689&replace=true',
    );
    expect(res.status).equal(200);
    res = await subscriptionRepository.findById(data[2].id);
    expect(res.state).equal('deleted');
  });
});

describe('DELETE /subscriptions/{id}', function () {
  let data: any[];
  beforeEach(async function () {
    data = await Promise.all([
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userId: 'bar',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          confirmationRequest: {
            confirmationCodeRegex: '\\d{5}',
            sendRequest: true,
            from: 'no_reply@invlid.local',
            subject: 'Subscription confirmation',
            textBody: 'enter {confirmation_code} in this email',
            confirmationCode: '37688',
          },
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          confirmationRequest: {
            confirmationCodeRegex: '\\d{5}',
            sendRequest: true,
            from: 'no_reply@invlid.local',
            subject: 'Subscription confirmation',
            textBody: 'enter {confirmation_code} in this email',
            confirmationCode: '37689',
          },
          unsubscriptionCode: '50032',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'unconfirmed',
          confirmationRequest: {
            confirmationCodeRegex: '\\d{5}',
            sendRequest: true,
            from: 'no_reply@invlid.local',
            subject: 'Subscription confirmation',
            textBody: 'enter {confirmation_code} in this email',
            confirmationCode: '37689',
          },
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'redirectAck',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '12345',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'redirectAck',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'deleted',
          unsubscriptionCode: '12345',
        });
      })(),
      (async () => {
        return configurationRepository.create({
          name: 'subscription',
          serviceName: 'redirectAck',
          value: {
            anonymousUnsubscription: {
              acknowledgements: {
                onScreen: {
                  redirectUrl: 'http://nowhere',
                },
              },
            },
          },
        });
      })(),
    ]);
  });

  it('should allow unsubscription by sm user', async function () {
    let res: any = await client
      .delete('/api/subscriptions/' + data[0].id)
      .set('Accept', 'application/json')
      .set('SM_USER', 'bar');
    expect(res.status).equal(200);
    res = await subscriptionRepository.findById(data[0].id);
    expect(res.state).equal('deleted');
  });

  it('should allow unsubscription by anonymous user', async function () {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[1].id +
          '/unsubscribe?unsubscriptionCode=50032',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    res = await subscriptionRepository.findById(data[1].id);
    expect(res.state).equal('deleted');
  });

  it('should deny unsubscription by anonymous user with incorrect unsubscriptionCode', async function () {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[1].id +
          '/unsubscribe?unsubscriptionCode=50033',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(403);
    res = await subscriptionRepository.findById(data[1].id);
    expect(res.state).equal('confirmed');
  });

  it('should deny unsubscription if state is not confirmed', async function () {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[2].id +
          '/unsubscribe?unsubscriptionCode=50033',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(403);
    res = await subscriptionRepository.findById(data[2].id);
    expect(res.state).equal('unconfirmed');
  });

  it('should deny unsubscription by another sm user', async function () {
    let res: any = await client
      .delete('/api/subscriptions/' + data[0].id)
      .set('Accept', 'application/json')
      .set('SM_USER', 'baz');
    expect(res.status).equal(404);
    res = await subscriptionRepository.findById(data[0].id);
    expect(res.state).equal('confirmed');
  });

  it('should redirect onscreen acknowledgements', async function () {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[3].id +
          '/unsubscribe?unsubscriptionCode=12345',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(302);
    expect(res.header.location).equal('http://nowhere?channel=email');
    res = await subscriptionRepository.findById(data[3].id);
    expect(res.state).equal('deleted');
  });

  it('should redirect onscreen acknowledgements with error', async function () {
    sinon
      .stub(BaseController.prototype, 'getMergedConfig')
      .callsFake(async function () {
        return {
          anonymousUnsubscription: {
            acknowledgements: {
              onScreen: {
                redirectUrl: 'http://nowhere',
              },
            },
          },
        };
      });

    const res = await client
      .get(
        '/api/subscriptions/' +
          data[4].id +
          '/unsubscribe?unsubscriptionCode=12345',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(302);
    expect(res.header.location).equal(
      'http://nowhere?channel=email&err=ForbiddenError%3A%20Forbidden',
    );
  });

  it('should display onScreen acknowledgements failureMessage', async function () {
    sinon
      .stub(BaseController.prototype, 'getMergedConfig')
      .callsFake(async function () {
        return {
          anonymousUnsubscription: {
            acknowledgements: {
              onScreen: {
                failureMessage: 'fail',
              },
            },
          },
        };
      });

    const res = await client
      .get(
        '/api/subscriptions/' +
          data[4].id +
          '/unsubscribe?unsubscriptionCode=12345',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(403);
    expect(res.text).equal('fail');
    expect(res.type).equal('text/plain');
  });
});

describe('GET /subscriptions/{id}/unsubscribe', function () {
  let data: Subscription[];
  beforeEach(async function () {
    data = await Promise.all([
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService1',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '12345',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService2',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '54321',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService3',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'confirmed',
          unsubscriptionCode: '11111',
        });
      })(),
    ]);
  });

  it('should allow bulk unsubscribing all services', async function () {
    sinon
      .stub(BaseController.prototype, 'getMergedConfig')
      .callsFake(async function () {
        return {
          anonymousUnsubscription: {
            acknowledgements: {
              onScreen: {successMessage: ''},
              notification: {
                email: {
                  from: 'no_reply@invalid.local',
                  subject: '',
                  textBody: '{unsubscription_service_names}',
                  htmlBody: '{unsubscription_service_names}',
                },
              },
            },
          },
        };
      });

    let res: any = await client.get(
      '/api/subscriptions/' +
        data[0].id +
        '/unsubscribe?unsubscriptionCode=12345&additionalServices=_all',
    );
    expect(res.status).equal(200);
    res = await subscriptionRepository.find({
      where: {
        state: 'deleted',
      },
    });
    expect(res.length).equal(3);
    sinon.assert.calledWith(
      BaseController.prototype.sendEmail as sinon.SinonStub,
      sinon.match.has(
        'text',
        sinon.match('services myService1, myService2 and myService3'),
      ),
    );
  });

  it('should allow bulk unsubscribing selected additional service', async function () {
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[0].id +
        '/unsubscribe?unsubscriptionCode=12345&additionalServices=myService3',
    );
    expect(res.status).equal(200);
    res = await subscriptionRepository.find({
      where: {
        state: 'deleted',
      },
    });
    expect(res.length).equal(2);
  });

  it('should allow bulk unsubscribing selected additional service as an array', async function () {
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[0].id +
        '/unsubscribe?unsubscriptionCode=12345&additionalServices[]=myService3',
    );
    expect(res.status).equal(200);
    res = await subscriptionRepository.find({
      where: {
        state: 'deleted',
      },
    });
    expect(res.length).equal(2);
  });
});
// end: ported

describe('GET /subscriptions/{id}/unsubscribe/undo', function () {
  let data: Subscription[];
  beforeEach(async function () {
    data = await Promise.all([
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'deleted',
          unsubscriptionCode: '50032',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'unconfirmed',
          confirmationRequest: {
            confirmationCodeRegex: '\\d{5}',
            sendRequest: true,
            from: 'no_reply@invlid.local',
            subject: 'Subscription confirmation',
            textBody: 'enter {confirmation_code} in this email',
            confirmationCode: '37689',
          },
          unsubscriptionCode: '50032',
        });
      })(),
      (async () => {
        return subscriptionRepository.create({
          serviceName: 'myService2',
          channel: 'email',
          userChannelId: 'bar@foo.com',
          state: 'deleted',
          unsubscriptionCode: '12345',
          unsubscribedAdditionalServices: {
            names: ['myService'],
            ids: [1],
          },
        });
      })(),
    ]);
  });

  it('should allow undelete subscription by anonymous user', async function () {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[0].id +
          '/unsubscribe/undo?unsubscriptionCode=50032',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(200);
    res = await subscriptionRepository.findById(data[0].id);
    expect(res.state).equal('confirmed');
  });

  it('should forbid undelete subscription by anonymous user with incorrect unsubscriptionCode', async function () {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[0].id +
          '/unsubscribe/undo?unsubscriptionCode=50033',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(403);
    res = await subscriptionRepository.findById(data[0].id);
    expect(res.state).equal('deleted');
  });

  it('should forbid undelete subscription where state is not deleted', async function () {
    let res: any = await client
      .get(
        '/api/subscriptions/' +
          data[1].id +
          '/unsubscribe/undo?unsubscriptionCode=50032',
      )
      .set('Accept', 'application/json');
    expect(res.status).equal(403);
    res = await subscriptionRepository.findById(data[1].id);
    expect(res.state).equal('unconfirmed');
  });

  it('should redirect response if set so', async function () {
    await configurationRepository.create({
      name: 'subscription',
      serviceName: 'myService',
      value: {
        anonymousUndoUnsubscription: {
          redirectUrl: 'http://nowhere',
        },
      },
    });
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[0].id +
        '/unsubscribe/undo?unsubscriptionCode=50032',
    );
    expect(res.status).equal(302);
    expect(res.headers.location).equal('http://nowhere?channel=email');
    res = await subscriptionRepository.findById(data[0].id);
    expect(res.state).equal('confirmed');
  });

  it('should allow bulk undo unsubscriptions by anonymous user', async function () {
    let res: any = await client.get(
      '/api/subscriptions/' +
        data[2].id +
        '/unsubscribe/undo?unsubscriptionCode=12345',
    );
    expect(res.status).equal(200);
    res = await subscriptionRepository.findById(data[0].id);
    expect(res.state).equal('confirmed');
    res = await subscriptionRepository.findById(data[2].id);
    expect(res.unsubscribedAdditionalServices).undefined();
  });
});

describe('PUT /subscriptions/{id}', function () {
  beforeEach(async function () {
    await subscriptionRepository.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@invalid.local',
      state: 'confirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in this email',
        confirmationCode: '37688',
      },
      unsubscriptionCode: '50032',
    });
  });
  it('should allow admin user replace subscription', async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => {
        return true;
      });
    const res = await client
      .put('/api/subscriptions/1')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userId: 'bar',
        userChannelId: 'bar@invalid.local',
        state: 'deleted',
        unsubscriptionCode: '50033',
      })
      .set('Accept', 'application/json');
    expect(res.body.state).equal('deleted');
    expect(res.body.confirmationRequest).undefined();
  });
  it('should deny anonymous user replace subscription', async function () {
    const res = await client
      .put('/api/subscriptions/1')
      .send({
        serviceName: 'myService',
        channel: 'email',
        userId: 'bar',
        userChannelId: 'bar@invalid.local',
        state: 'deleted',
        unsubscriptionCode: '50032',
      })
      .set('Accept', 'application/json');
    expect(res.status).equal(401);
  });
});

describe('GET /subscriptions/services', function () {
  beforeEach(async function () {
    await subscriptionRepository.create({
      serviceName: 'myService',
      channel: 'email',
      userId: 'bar',
      userChannelId: 'bar@invalid.local',
      state: 'confirmed',
      confirmationRequest: {
        confirmationCodeRegex: '\\d{5}',
        sendRequest: true,
        from: 'no_reply@invlid.local',
        subject: 'Subscription confirmation',
        textBody: 'enter {confirmation_code} in this email',
        confirmationCode: '37688',
      },
      unsubscriptionCode: '50032',
    });
  });
  it(`should allow admin user's access`, async function () {
    sinon
      .stub(BaseCrudRepository.prototype, 'isAdminReq')
      .callsFake(async () => {
        return true;
      });
    const res = await client
      .get('/api/subscriptions/services')
      .set('Accept', 'application/json');
    expect(res.body instanceof Array).equal(true);
    expect(res.body.length).equal(1);
  });
  it("should deny anonymous user's access", async function () {
    const res = await client
      .get('/api/subscriptions/services')
      .set('Accept', 'application/json');
    expect(res.status).equal(401);
  });
});

describe('POST /subscriptions/swift', function () {
  let origConfig: AnyObject;
  before(async function () {
    origConfig = await app.get(CoreBindings.APPLICATION_CONFIG);
    app.bind(CoreBindings.APPLICATION_CONFIG).to(
      _.merge({}, origConfig, {
        sms: {providerSettings: {swift: {notifyBCSwiftKey: '12345'}}},
      }),
    );
  });
  after(async function () {
    app.bind(CoreBindings.APPLICATION_CONFIG).to(origConfig);
  });
  beforeEach(async function () {
    await subscriptionRepository.create({
      serviceName: 'myService',
      channel: 'sms',
      userChannelId: '250-000-0000',
      state: 'confirmed',
      unsubscriptionCode: '12345',
    });
  });
  it(`should unsubscribe with valid id reference`, async function () {
    let res: any = await client.post('/api/subscriptions/swift').send({
      Reference: 1,
      PhoneNumber: '12500000000',
      notifyBCSwiftKey: '12345',
    });
    expect(res.status).equal(200);
    expect(res.text).equal('You have been un-subscribed.');
    res = await subscriptionRepository.findById('1');
    expect(res.state).equal('deleted');
  });
  it(`should unsubscribe with valid phone number`, async function () {
    let res: any = await client.post('/api/subscriptions/swift').send({
      PhoneNumber: '12500000000',
      notifyBCSwiftKey: '12345',
    });
    expect(res.status).equal(200);
    expect(res.text).equal('You have been un-subscribed.');
    res = await subscriptionRepository.findById('1');
    expect(res.state).equal('deleted');
  });
  it(`should deny invalid Reference`, async function () {
    let res: any = await client.post('/api/subscriptions/swift').send({
      Reference: 1,
      PhoneNumber: '12500000000',
      notifyBCSwiftKey: 'invalid',
    });
    expect(res.status).equal(403);
    res = await subscriptionRepository.findById('1');
    expect(res.state).equal('confirmed');
  });
});
