import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { User } from '../users/user.entity.js';
import { CreateParkingDto } from './dto/create-parking.dto.js';
import { ParkingPolicy } from './parking.policy.js';
import { ParkingsService } from './parkings.service.js';

@Controller('parkings')
export class ParkingsController {
  constructor(private readonly service: ParkingsService) {}

  @Can(ParkingPolicy, 'create')
  @Post()
  async create(@Body() dto: CreateParkingDto, @CurrentUser() user: User) {
    const data = await this.service.create(dto, user);
    return { message: 'Servicio de valet creado exitosamente', data };
  }

  @Can(ParkingPolicy, 'listAsSupervisor')
  @Get('supervisores/me')
  async findBySupervisor(@CurrentUser() user: User) {
    const data = await this.service.findBySupervisor(user);
    return { message: 'Obtuvo su lista de servicios', data };
  }

  @Can(ParkingPolicy, 'listAll')
  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return { message: 'Obtuvo la lista de servicios', data };
  }

  @Can.Anyone()
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    await this.service.remove(id, user);
    return { message: 'Servicio eliminado exitosamente' };
  }
}
