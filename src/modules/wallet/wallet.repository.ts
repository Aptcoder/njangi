import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

interface WalletData {
  userId: string;
}
@Injectable()
export default class WalletRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find() {
    const wallets = await this.prismaService.wallet.findMany({});
    return wallets;
  }

  async findOne(query: object) {
    const wallet = await this.prismaService.wallet.findFirst({
      where: query,
    });

    return wallet;
  }

  async create(wallerData: WalletData, tx?: Prisma.TransactionClient) {
    const client = tx ? tx : this.prismaService;
    const wallet = await client.wallet.create({
      data: {
        user: {
          connect: {
            id: wallerData.userId,
          },
        },
      },
    });
    return wallet;
  }
}
