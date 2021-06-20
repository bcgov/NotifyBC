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

import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('g8')
export class CronObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    private jobs: any[] = [],
  ) {}

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    // Add your logic for start
    if (process.env.NOTIFYBC_NODE_ROLE === 'slave') {
      return;
    }
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const CronJob = require('cron').CronJob;
    const cronTasks = require('./cron-tasks');
    const cronConfig: AnyObject =
      (await this.app.getConfig(CoreBindings.APPLICATION_INSTANCE, 'cron')) ??
      {};
    // start purgeData cron
    const cronConfigPurgeData = cronConfig.purgeData || {};
    this.jobs.push(
      new CronJob({
        cronTime: cronConfigPurgeData.timeSpec,
        onTick: await cronTasks.purgeData(this.app),
        start: true,
      }),
    );
    // start dispatchLiveNotifications cron
    const cronConfigDispatchLiveNotifications =
      cronConfig.dispatchLiveNotifications || {};
    this.jobs.push(
      new CronJob({
        cronTime: cronConfigDispatchLiveNotifications.timeSpec,
        onTick: cronTasks.dispatchLiveNotifications(this.app),
        start: true,
      }),
    );
    // start checkRssConfigUpdates cron
    const cronConfigCheckRssConfigUpdates =
      cronConfig.checkRssConfigUpdates || {};
    this.jobs.push(
      new CronJob({
        cronTime: cronConfigCheckRssConfigUpdates.timeSpec,
        onTick: async () => {
          await cronTasks.checkRssConfigUpdates(this.app);
        },
        start: true,
      }),
    );
    // start deleteBounces cron
    const deleteBounces = cronConfig.deleteBounces || {};
    this.jobs.push(
      new CronJob({
        cronTime: deleteBounces.timeSpec,
        onTick: await cronTasks.deleteBounces(this.app),
        start: true,
      }),
    );
    const reDispatchBroadcastPushNotifications =
      cronConfig.reDispatchBroadcastPushNotifications || {};
    this.jobs.push(
      new CronJob({
        cronTime: reDispatchBroadcastPushNotifications.timeSpec,
        onTick: cronTasks.reDispatchBroadcastPushNotifications(this.app),
        start: true,
      }),
    );
  }
  async stop(): Promise<void> {
    for (const job of this.jobs) {
      job.stop();
    }
  }
}
