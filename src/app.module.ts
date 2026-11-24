import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule, type Duration } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ParkingsModule } from './parkings/parkings.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: config.get('DB_SYNC') === 'true',
      }),
    }),
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        allowInMemoryStorage: true,
        accessToken: {
          key: config.getOrThrow<string>('JWT_SECRET'),
          issuer: 'roles-y-usuarios-api',
          audience: 'roles-y-usuarios-clients',
          ttl: config.get<Duration>('JWT_EXPIRES_IN', '2m'),
        },
        refreshToken: {
          ttl: config.get<Duration>('JWT_REFRESH_EXPIRES_IN', '7d'),
          absoluteTtl: '30d',
        },
      }),
    }),
    AuthorizationModule.forRoot(),
    UsersModule,
    RolesModule,
    AuthModule,
    ParkingsModule,
    ReservationsModule,
  ],
})
export class AppModule {}