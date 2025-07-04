import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { DataSource } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserLoginDetail } from './user-login-detail.entity';
import { AuditUserLogin } from './audit-user-login.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserLoginDetail, AuditUserLogin]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        secret: configService.get('JWT_SECRET') || 'defaultSecret',
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) => {
        return new UsersRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [PassportModule],
})
export class AuthModule {}
