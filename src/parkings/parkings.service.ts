import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthorizationService } from '@nestjs/authorization';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ADMIN_ROLE, CONDUCTOR_ROLE, hasRole, SUPERVISOR_ROLE } from '../roles/roles.constants.js';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { Parking } from './parking.entity.js';
import { ParkingPolicy } from './parking.policy.js';
import { CreateParkingDto } from './dto/create-parking.dto.js';

@Injectable()
export class ParkingsService {
  constructor(
    @InjectRepository(Parking) private readonly parkings: Repository<Parking>,
    private readonly users: UsersService,
    private readonly authz: AuthorizationService,
  ) {}

  canCreate(user: User) {
    return this.authz.can(ParkingPolicy, 'create', user);
  }

  async findOne(id: string) {
    const parking = await this.parkings.findOneBy({ id });
    if (!parking) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return parking;
  }

  async create(dto: CreateParkingDto, user: User) {
    const admin = await this.users.findById(dto.id);
    
    if (!hasRole(user, ADMIN_ROLE)) {
      throw new BadRequestException('Solo los administradores pueden crear servicios de valet');
    }

    return this.parkings.save(
      this.parkings.create({
        id: user.id,
        code: dto.code,
        charger_type: dto.charger_type,
        id_supervisor: dto.id_supervisor,
        created_at: new Date(),
      }),
    );
  }

  findBySupervisor(user: User) {
    return this.parkings.find({ where: { id_supervisor: user.id }});
  }

  findAll() {
    return this.parkings.find();
  }

  async remove(id: string, user: User) {
    const parking = await this.findOne(id);
    await this.authz.authorize(ParkingPolicy, 'remove', user, parking);
    await this.parkings.remove(parking);
  }
}
