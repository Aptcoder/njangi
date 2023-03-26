import { Injectable, NotFoundException } from '@nestjs/common';
import { NjangiInviteStatus } from 'src/common/constants';
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

  async getNjangi(njangiId) {
    return this.njangiRepository.findOne({
      id: njangiId,
    });
  }

  async getUserNjangis(userId: string) {
    const njangiUsers = await this.njangiRepository.findNjangiUsers({
      userId,
    });

    return njangiUsers;
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
    return await this.njangiRepository.$transaction(async (tx) => {
      let invite = await this.njangiRepository.findOneNjangiInvite({
        id: njangiInviteId,
      });
      if (!invite) {
        throw new NotFoundException('Invite not found');
      }

      if (
        updateInviteDTO.status === NjangiInviteStatus.accepted &&
        invite.status !== NjangiInviteStatus.accepted
      ) {
        await this.njangiRepository.createNjangiUser(
          {
            njangiId: invite.njangiId,
            userId: invite.userId,
          },
          tx,
        );
      }

      invite = await this.njangiRepository.UpdateNjangiInvite(
        njangiInviteId,
        updateInviteDTO,
        tx,
      );

      return invite;
    });
  }
}
