import { Controller, Get } from '@nestjs/common';
import Helper from 'src/common/helpers';
import UserService from './user.service';

@Controller('/users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers() {
    const users = await this.userService.getUsers();
    return Helper.formatResponse('Users', { users });
  }
}
