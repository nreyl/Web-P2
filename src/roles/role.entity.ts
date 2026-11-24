import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity.js';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  role_name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}