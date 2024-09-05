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

import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CronJob } from 'cron';
import { AppConfigService } from 'src/config/app-config.service';
import { CronTasksService } from './cron-tasks.service';

@Injectable()
export class CronService implements OnApplicationBootstrap {
  readonly appConfig;
  private jobs: any[] = [];
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly cronTasksService: CronTasksService,
  ) {
    this.appConfig = appConfigService.get();
  }

  async onApplicationBootstrap() {
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      return;
    }
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const cronConfig = this.appConfigService.get('cron') ?? {};
    // start purgeData cron
    const cronConfigPurgeData = cronConfig.purgeData || {};
    this.jobs.push(
      CronJob.from({
        cronTime: cronConfigPurgeData.timeSpec,
        onTick: async () => {
          await this.cronTasksService.purgeData();
        },
        start: true,
      }),
    );
    // start dispatchLiveNotifications cron
    const cronConfigDispatchLiveNotifications =
      cronConfig.dispatchLiveNotifications || {};
    this.jobs.push(
      CronJob.from({
        cronTime: cronConfigDispatchLiveNotifications.timeSpec,
        onTick: async () => {
          await this.cronTasksService.dispatchLiveNotifications();
        },
        start: true,
      }),
    );
    // start checkRssConfigUpdates cron
    const cronConfigCheckRssConfigUpdates =
      cronConfig.checkRssConfigUpdates || {};
    this.jobs.push(
      CronJob.from({
        cronTime: cronConfigCheckRssConfigUpdates.timeSpec,
        onTick: async () => {
          await this.cronTasksService.checkRssConfigUpdates();
        },
        start: true,
      }),
    );
    // start deleteBounces cron
    const deleteBounces = cronConfig.deleteBounces || {};
    this.jobs.push(
      CronJob.from({
        cronTime: deleteBounces.timeSpec,
        onTick: async () => {
          await this.cronTasksService.deleteBounces();
        },
        start: true,
      }),
    );
    const reDispatchBroadcastPushNotifications =
      cronConfig.reDispatchBroadcastPushNotifications || {};
    this.jobs.push(
      CronJob.from({
        cronTime: reDispatchBroadcastPushNotifications.timeSpec,
        onTick: async () => {
          await this.cronTasksService.reDispatchBroadcastPushNotifications();
        },
        start: true,
      }),
    );

    if (
      (this.appConfig.sms?.throttle?.enabled &&
        this.appConfig.sms?.throttle?.clearDatastore !== true &&
        this.appConfig.sms?.throttle?.datastore !== 'local') ||
      (this.appConfig.email?.throttle?.enabled &&
        this.appConfig.email?.throttle?.clearDatastore !== true &&
        this.appConfig.email?.throttle?.datastore !== 'local')
    ) {
      const clearRedisDatastore = cronConfig.clearRedisDatastore || {};
      this.jobs.push(
        CronJob.from({
          cronTime: clearRedisDatastore.timeSpec,
          onTick: async () => {
            await this.cronTasksService.clearRedisDatastore();
          },
          start: true,
          runOnInit: true,
        }),
      );
    }
  }
}
