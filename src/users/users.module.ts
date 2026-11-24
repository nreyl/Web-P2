import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/role.entity.js';
import { User } from './user.entity.js';
import { UserPolicy } from './user.policy.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, UserPolicy],
  exports: [UsersService],
})
export class UsersModule {}
