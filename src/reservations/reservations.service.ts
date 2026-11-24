import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthorizationService } from '@nestjs/authorization';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ADMIN_ROLE, CONDUCTOR_ROLE, hasRole, SUPERVISOR_ROLE } from '../roles/roles.constants.js';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { ReservationPolicy } from './reservations.policy.js';
import { Reservation } from './entities/reservation.entity.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { Parking } from '../parkings/parking.entity.js';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private readonly reservations: Repository<Reservation>,
    private readonly users: UsersService,
    private readonly authz: AuthorizationService,
  ) {}

  canCreate(user: User) {
    return this.authz.can(ReservationPolicy, 'create', user);
  }

  async findOne(id: string) {
    const reservation = await this.reservations.findOneBy({ id });
    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }
    return reservation;
  }

  async create(dto: CreateReservationDto, user: User, parking: Parking, date: Date, vehicle_plate: string, vehicle_max_charge: number) {
    const admin = await this.users.findById(dto.id);
    
    if (!hasRole(user, ADMIN_ROLE)) {
      throw new BadRequestException('Solo los administradores pueden crear servicios de valet');
    }

    return this.reservations.save(
      this.reservations.create({
        id: dto.id,
        id_user: user.id,
        id_spot: parking.id,
        date: dto.date,
        vehicle_plate: dto.vehicle_plate,
        vehicle_max_charge: dto.vehicle_max_charge,
        created_at: new Date(),
      }),
    );
  }

  findBySupervisor(user: User) {
    return this.reservations.find({ where: { id_supervisor: user.id }});
  }

  findAll() {
    return this.reservations.find();
  }

  async remove(id: string, user: User) {
    const reservation = await this.findOne(id);
    await this.authz.authorize(ReservationPolicy, 'remove', user, reservation);
    await this.reservations.remove(reservation);
  }
}
