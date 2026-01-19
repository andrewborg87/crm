import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards, applyDecorators } from '@nestjs/common';

import { AuthStrategy } from '@crm/types';

import { UserStatusGuard } from '../guards';

export function Auth(strategies: AuthStrategy[] = [AuthStrategy.JWT]): ClassDecorator & MethodDecorator {
  // Apply these guards to the endpoint
  const items = [UseGuards(AuthGuard(strategies))];
  items.push(UseGuards(UserStatusGuard));

  return applyDecorators(...items, ApiBearerAuth());
}
