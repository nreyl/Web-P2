import { Body, Controller, Get, Post } from '@nestjs/common';
import { Can } from '@nestjs/authorization';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { RolePolicy } from './role.policy.js';
import { RolesService } from './roles.service.js';

@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Can(RolePolicy, 'create')
  @Post()
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.service.create(dto);
    return { message: 'Rol creado con éxito', roleId: role.id };
  }

  @Can(RolePolicy, 'findAll')
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
