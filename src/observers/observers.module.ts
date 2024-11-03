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

import { Module } from '@nestjs/common';
import { AdministratorsModule } from 'src/api/administrators/administrators.module';
import { BouncesModule } from 'src/api/bounces/bounces.module';
import { ConfigurationsModule } from 'src/api/configurations/configurations.module';
import { NotificationsModule } from 'src/api/notifications/notifications.module';
import { SubscriptionsModule } from 'src/api/subscriptions/subscriptions.module';
import { ConfigModule } from 'src/config/config.module';
import { RssModule } from 'src/rss/rss.module';
import { CronTasksService } from './cron-tasks.service';
import { CronService } from './cron.service';
import { EmailQueueConsumer } from './email-queue-consumer';
import { IndexDBSchemaService } from './index-dbschema.service';
import { MiddlewareAllService } from './middleware-all.service';
import { RsaService } from './rsa.service';
import { ShutdownService } from './shutdown.service';
import { SmsQueueConsumer } from './sms-queue-consumer';
import { SmtpService } from './smtp.service';
import { SwaggerService } from './swagger.service';
import { WebAdminConsoleService } from './web-admin-console.service';

@Module({
  providers: [
    RsaService,
    IndexDBSchemaService,
    CronTasksService,
    CronService,
    SmtpService,
    ShutdownService,
    WebAdminConsoleService,
    SwaggerService,
    MiddlewareAllService,
    EmailQueueConsumer,
    SmsQueueConsumer,
  ],
  imports: [
    ConfigurationsModule,
    NotificationsModule,
    SubscriptionsModule,
    BouncesModule,
    AdministratorsModule,
    RssModule,
    ConfigModule,
  ],
  exports: [ShutdownService],
})
export class ObserversModule {}
