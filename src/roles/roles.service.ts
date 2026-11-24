import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { Role } from './role.entity.js';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roles: Repository<Role>) {}

  async create(dto: CreateRoleDto) {
    if (await this.roles.existsBy({ role_name: dto.role_name })) {
      throw new ConflictException('role_name ya existe');
    }
    return this.roles.save(this.roles.create(dto));
  }

  async findAll() {
    try {
      const roles = await this.roles.find();
      return roles.map(({ id, role_name, description }) => ({ id, role_name, description }));
    } catch {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }
}
