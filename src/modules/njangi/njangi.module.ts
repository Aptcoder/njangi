import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import UserRepository from '../user/user.repository';
import InviteController from './invite.controller';
import NjangiController from './njangi.controller';
import NjangiRepository from './njangi.repository';
import NjangiService from './njangi.service';

@Module({
  imports: [UserModule],
  controllers: [NjangiController, InviteController],
  providers: [NjangiService, NjangiRepository, UserRepository],
  exports: [NjangiService],
})
export class NjangiModule {}
