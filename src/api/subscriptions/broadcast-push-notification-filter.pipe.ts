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
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import jmespath from 'jmespath';

@Injectable()
export class BroadcastPushNotificationFilterPipe implements PipeTransform {
  transform(value: any) {
    let filter = value.broadcastPushNotificationFilter;
    if (!filter) {
      return value;
    }
    if (typeof filter !== 'string') {
      throw new HttpException(
        'invalid broadcastPushNotificationFilter',
        HttpStatus.BAD_REQUEST,
      );
    }
    filter = '[?' + filter + ']';
    try {
      jmespath.compile(filter);
    } catch (ex) {
      throw new HttpException(
        'invalid broadcastPushNotificationFilter',
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
