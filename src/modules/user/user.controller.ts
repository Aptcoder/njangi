import { Body, Controller, Get, Post } from '@nestjs/common';
import { SignInUserDTO, SignUpUserDTO } from 'src/common/dtos/user.dtos';
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

  @Post('/')
  async signUp(@Body() signUpUserDTO: SignUpUserDTO) {
    const user = await this.userService.signUpUser(signUpUserDTO);
    return Helper.formatResponse('User signed up', { user });
  }

  @Post('/auth')
  async signIn(@Body() signInUserDTO: SignInUserDTO) {
    const { user, accessToken } = await this.userService.authUser(
      signInUserDTO,
    );
    return Helper.formatResponse('User signed in', { user, accessToken });
  }
}
