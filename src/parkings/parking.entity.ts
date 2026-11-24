import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';
import { User } from '../users/user.entity.js';

@Entity('parkings')
export class Parking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  id_user: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column({ type: 'varchar'})
  code: string;

  @Column({ type: 'varchar'})
  charger_type: string;

  @Column({ type: 'uuid' })
  id_supervisor: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_supervisor' })
  supervisor: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
