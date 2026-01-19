import { UserCreatedDto } from '../dto';
import { BaseEvent } from '../base.event';

/**
 * Occurs when a new integration is created in the system
 **/
export class UserCreatedEvent extends BaseEvent<UserCreatedDto, void> {
  static readonly type = 'user.created';

  constructor(payload: UserCreatedDto) {
    super(payload);
  }
}
