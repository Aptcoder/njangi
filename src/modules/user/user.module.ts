import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import UserController from './user.controller';
import UserRepository from './user.repository';
import UserService from './user.service';
import { jwtConfig } from '../../config/jwt.config';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [JwtModule.registerAsync(jwtConfig)],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy],
  exports: [UserRepository],
})
export class UserModule {}
