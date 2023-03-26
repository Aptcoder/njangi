import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

type ClientType = Prisma.TransactionClient;
// Omit<
//   PrismaService,
//   '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
// >;
@Injectable()
export default class NjangiRepository {
  constructor(private readonly prismaService: PrismaService) {}

  $transaction(func: (prisma: Prisma.TransactionClient) => Promise<unknown>) {
    return this.prismaService.$transaction(func);
  }

  async find(query: object = {}) {
    const njangis = await this.prismaService.njangi.findMany({
      where: query,
    });
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

  async findNjangiUsers(query: object = {}) {
    const njangiUsers = await this.prismaService.njangiUsers.findMany({
      where: query,
      include: {
        njangi: true,
      },
    });
    return njangiUsers;
  }

  async UpdateNjangiInvite(
    njangiInviteId: string,
    inviteUpdateData: {
      status: 'pending' | 'accepted' | 'ignored';
    },
    tx?: ClientType,
  ) {
    const client = tx ? tx : this.prismaService;
    const invite = await client.njangiInvite.update({
      data: inviteUpdateData,
      where: {
        id: njangiInviteId,
      },
    });
    return invite;
  }

  async findOne(query: object) {
    const user = await this.prismaService.njangi.findFirst({
      where: query,
      include: {
        users: true,
        invites: true,
      },
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

  async createNjangiUser(input: InviteInputData, tx?: ClientType) {
    const client = tx ? tx : this.prismaService;
    const njangiUser = await client.njangiUsers.create({
      data: {
        role: 'member',
        user: {
          connect: {
            id: input.userId,
          },
        },
        njangi: {
          connect: {
            id: input.njangiId,
          },
        },
      },
    });
    return njangiUser;
  }
}
