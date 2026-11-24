import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
  constructor(
    private readonly users: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this, { order: 1 });
  }

  validate({ sub }: JwtClaims) {
    return sub ? this.users.findById(sub) : null;
  }
}
