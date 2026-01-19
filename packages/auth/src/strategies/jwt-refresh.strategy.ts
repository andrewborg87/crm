import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthStrategy } from '@crm/types';

import { AuthModuleOptions } from '../auth.module';
import { JwtRefreshPayloadType } from '../types/jwt-refresh-payload.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT_REFRESH) {
  constructor(@Inject('AUTH_CONFIG_OPTIONS') private readonly opts: AuthModuleOptions) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.['refresh-token'] || null,
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Fallback to the Authorization header for backward compatibility
      ]),
      secretOrKey: opts.refreshSecret,
    });
  }

  public validate(payload: JwtRefreshPayloadType): JwtRefreshPayloadType | never {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
