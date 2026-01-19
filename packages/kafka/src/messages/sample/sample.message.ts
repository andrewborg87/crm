import { SampleDto } from '../dto';
import { BaseMessage } from '../base.message';

export class SampleMessage extends BaseMessage<SampleDto, void> {
  static readonly type = 'message.sample';
}
