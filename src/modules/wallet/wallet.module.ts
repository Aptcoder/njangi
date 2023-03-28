import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import WalletRepository from './wallet.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [WalletRepository],
  exports: [WalletRepository],
})
export class WalletModule {}
