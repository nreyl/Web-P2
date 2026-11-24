import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RegisterDto } from '../auth/dto/auth.dto.js';
import { Role } from '../roles/role.entity.js';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    private readonly hasher: PasswordHasher,
  ) {}

  findById(id: string) {
    return this.users.findOne({ where: { id }, relations: { roles: true } });
  }

  findByEmail(email: string) {
    return this.users.findOneBy({ email });
  }

  async register(dto: RegisterDto) {
    if (await this.users.existsBy({ email: dto.email })) {
      throw new ConflictException('Email ya registrado');
    }
    const password = await this.hasher.hash(dto.password);
    return this.users.save(
      this.users.create({
        email: dto.email,
        password,
        name: dto.name,
        phone: dto.phone,
      }),
    );
  }

  async verifyCredentials(email: string, password: string) {
    const user = await this.findByEmail(email);
    const valid = await this.hasher.verify(password, user?.password);
    if (!user || !valid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    if (!user.is_active) {
      throw new HttpException('Usuario desactivado', HttpStatus.LOCKED);
    }
    return user;
  }

  async findMe(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roles: user.roles.map((role) => role.role_name),
    };
  }

  async findAll() {
    try {
      const users = await this.users.find({ relations: { roles: true } });
      return users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((role) => role.role_name),
      }));
    } catch {
      throw new InternalServerErrorException('Error al listar usuarios');
    }
  }

  async assignRoles(id: string, roleNames: string[]) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const names = [...new Set(roleNames)];
    const found = await this.roles.findBy({ role_name: In(names) });
    if (found.length !== names.length) {
      throw new BadRequestException('roles inválidos');
    }
    user.roles = found;
    await this.users.save(user);
  }
}
