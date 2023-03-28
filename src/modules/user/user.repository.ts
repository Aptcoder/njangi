import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

interface UserData {
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
}

const userSelectOption = {
  phoneNumber: true,
  id: true,
  firstName: true,
  lastName: true,
};

@Injectable()
export default class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  $transaction(func: (prisma: Prisma.TransactionClient) => Promise<unknown>) {
    return this.prismaService.$transaction(func);
  }

  async find() {
    const users = await this.prismaService.user.findMany({
      select: { ...userSelectOption, wallet: true },
    });
    return users;
  }

  async findOne(query: object) {
    const user = await this.prismaService.user.findFirst({
      where: query,
    });

    return user;
  }

  async create(userData: UserData, tx?: Prisma.TransactionClient) {
    const client = tx ? tx : this.prismaService;
    const user = await client.user.create({
      data: userData,
      select: userSelectOption,
    });
    return user;
  }
}
