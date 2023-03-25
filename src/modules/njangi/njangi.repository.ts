import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

interface NjangiData {
  name: string;
  maxUsers?: number;
  creatorId: string;
  amount: number;
}

interface InviteInputData {
  userId: string;
  njangiId: string;
}

@Injectable()
export default class NjangiRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find() {
    const njangis = await this.prismaService.njangi.findMany();
    return njangis;
  }

  async findNjnagiInvites(query: object = {}) {
    const invites = await this.prismaService.njangiInvite.findMany({
      where: query,
      include: {
        njangi: true,
      },
    });
    return invites;
  }

  async UpdateNjangiInvite(
    njangiInviteId: string,
    inviteUpdateData: {
      status: 'pending' | 'accepted' | 'ignored';
    },
  ) {
    const invite = await this.prismaService.njangiInvite.update({
      data: inviteUpdateData,
      where: {
        id: njangiInviteId,
      },
    });
    return invite;
  }

  async findOne(query: object) {
    const user = await this.prismaService.user.findFirst({
      where: query,
    });

    return user;
  }

  async findOneNjangiUser(query: object) {
    const njangiUser = await this.prismaService.njangiUsers.findFirst({
      where: query,
    });
    return njangiUser;
  }

  async findOneNjangiInvite(query: object) {
    const njangiInvite = await this.prismaService.njangiInvite.findFirst({
      where: query,
    });
    return njangiInvite;
  }

  async create(njangiData: NjangiData) {
    const creatorId = njangiData.creatorId;
    delete njangiData.creatorId;
    const njangi = await this.prismaService.njangi.create({
      data: {
        ...njangiData,
        users: {
          create: [
            {
              role: 'creator',
              user: {
                connect: {
                  id: creatorId,
                },
              },
            },
          ],
        },
      },
    });
    return njangi;
  }

  async createInvite(inviteInput: InviteInputData) {
    const invite = await this.prismaService.njangiInvite.create({
      data: {
        user: {
          connect: {
            id: inviteInput.userId,
          },
        },
        njangi: {
          connect: {
            id: inviteInput.njangiId,
          },
        },
      },
    });
    return invite;
  }
}
