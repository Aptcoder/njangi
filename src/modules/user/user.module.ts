import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import UserController from './user.controller';
import UserRepository from './user.repository';
import UserService from './user.service';
import { jwtConfig } from '../../config/jwt.config';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { WalletModule } from '../wallet/wallet.module';
import WalletRepository from '../wallet/wallet.repository';

@Module({
  imports: [JwtModule.registerAsync(jwtConfig), WalletModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy, WalletRepository],
  exports: [UserRepository],
})
export class UserModule {}
