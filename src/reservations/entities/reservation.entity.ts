import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import { Parking } from '../../parkings/parking.entity.js';
import { User } from '../../users/user.entity.js';
import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../dto/create-reservation.dto.js';


@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
    id_user: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_user' })
    user: User;

    @Column({ type: 'uuid' })
    id_spot: string;

    @ManyToOne(() => Parking, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_spot' })
    spot: Parking;

    @CreateDateColumn({ type: 'timestamp' })
    date: Date;

    @Column({ type: 'varchar'})
    vehicle_plate: string;

    @Column({ type: 'number'})
    vehicle_max_charge: number;

    @IsEnum( { message: 'status debe ser uno de los siguientes valores: pending, completed, cancelled' })
    @Column({ type: 'varchar'})
    status: ReservationStatus;

    @Column({ type: 'timestamp'})
    created_at: Date;
    id_supervisor: string | undefined;


}
