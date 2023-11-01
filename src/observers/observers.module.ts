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
import { IndexDBSchemaService } from './index-dbschema.service';
import { OidcDiscoveryService } from './oidc-discovery.service';
import { RsaService } from './rsa.service';
import { SmtpService } from './smtp.service';

@Module({
  providers: [
    RsaService,
    IndexDBSchemaService,
    CronTasksService,
    CronService,
    SmtpService,
    OidcDiscoveryService,
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
  exports: [OidcDiscoveryService],
})
export class ObserversModule {}
