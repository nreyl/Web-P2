import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { AssignRolesDto } from './dto/assign-roles.dto.js';
import { User } from './user.entity.js';
import { UserPolicy } from './user.policy.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Can(UserPolicy, 'viewSelf')
  @Get('me')
  me(@CurrentUser() user: User) {
    return this.service.findMe(user.id);
  }

  @Can(UserPolicy, 'findAll')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Can(UserPolicy, 'assignRoles')
  @Patch(':id/roles')
  async assignRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRolesDto,
  ) {
    await this.service.assignRoles(id, dto.roles);
    return { message: 'Roles asignados' };
  }
}
