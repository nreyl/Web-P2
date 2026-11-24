import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { User } from '../users/user.entity.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto.js';
import { ReservationPolicy } from './reservations.policy.js';
import { ReservationsService } from './reservations.service.js';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Can(ReservationPolicy, 'create')
  @Post()
  async create(@Body() dto: CreateReservationDto, @CurrentUser() user: User) {
    const data = await this.service.create(dto, user);
    return { message: 'Reservación creada exitosamente', data };
  }

  @Can(ReservationPolicy, 'listAsConductor')
  @Get('me')
  async findMine(@CurrentUser() user: User) {
    const data = await this.service.findByUser(user);
    return { message: 'Obtuvo su lista de reservaciones', data };
  }

  @Can(ReservationPolicy, 'listAsSupervisor')
  @Get('supervisores/me')
  async findBySupervisor(@CurrentUser() user: User) {
    const data = await this.service.findBySupervisor(user);
    return { message: 'Obtuvo la lista de reservaciones de sus spots', data };
  }

  @Can(ReservationPolicy, 'listAll')
  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { message: 'Obtuvo la lista de reservaciones', data };
  }

  @Can.Anyone()
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReservationStatusDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.service.updateStatus(id, dto, user);
    return { message: 'Estado actualizado correctamente', data };
  }

  @Can.Anyone()
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    await this.service.remove(id, user);
    return { message: 'Reservación eliminada exitosamente' };
  }
}
