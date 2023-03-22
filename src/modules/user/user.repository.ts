import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export default class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUsers() {
    const users = await this.prismaService.user.findMany();
    return users;
  }
}
