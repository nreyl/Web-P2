import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { JwtAuth } from './jwt.auth.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [JwtAuth],
})
export class AuthModule {}
