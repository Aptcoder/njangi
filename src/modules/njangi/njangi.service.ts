import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateNjangiDTO,
  UpdateNjangiInviteDTO,
} from 'src/common/dtos/njangi.dtos';
import UserRepository from '../user/user.repository';
import NjangiRepository from './njangi.repository';

@Injectable()
export default class NjangiService {
  constructor(
    private readonly njangiRepository: NjangiRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getNjangis() {
    return this.njangiRepository.find();
  }

  async createNjangi(createNjangiDTP: CreateNjangiDTO, userId: string) {
    const njangi = await this.njangiRepository.create({
      ...createNjangiDTP,
      creatorId: userId,
    });
    return njangi;
  }

  async createNjangiInvite(phoneNumber: string, njangiId: string) {
    const user = await this.userRepository.findOne({
      phoneNumber,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const invite = await this.njangiRepository.createInvite({
      userId: user.id,
      njangiId,
    });

    return invite;
  }

  async getNjangiInvites(njangiId?: string, userId?: string) {
    const query = {};
    if (njangiId) {
      query['njangiId'] = njangiId;
    }
    if (userId) {
      query['userId'] = userId;
    }
    const invites = await this.njangiRepository.findNjnagiInvites(query);
    return invites;
  }

  async updateNjangiInvite(
    njangiInviteId,
    updateInviteDTO: UpdateNjangiInviteDTO,
  ) {
    const invite = await this.njangiRepository.UpdateNjangiInvite(
      njangiInviteId,
      updateInviteDTO,
    );
    return invite;
  }
}
