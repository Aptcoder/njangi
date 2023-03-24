import { Injectable } from '@nestjs/common';
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

  async find() {
    const users = await this.prismaService.user.findMany({
      select: userSelectOption,
    });
    return users;
  }

  async findOne(query: object) {
    const user = await this.prismaService.user.findFirst({
      where: query,
    });

    return user;
  }

  async create(userData: UserData) {
    const user = await this.prismaService.user.create({
      data: userData,
      select: userSelectOption,
    });
    return user;
  }
}
