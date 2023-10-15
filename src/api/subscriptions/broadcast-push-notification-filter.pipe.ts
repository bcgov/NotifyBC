import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import jmespath from 'jmespath';

@Injectable()
export class BroadcastPushNotificationFilterPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
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
