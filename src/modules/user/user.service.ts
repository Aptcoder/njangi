import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInUserDTO, SignUpUserDTO } from 'src/common/dtos/user.dtos';
import UserRepository from './user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import WalletRepository from '../wallet/wallet.repository';

@Injectable()
export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
    private readonly jwtService: JwtService,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  async signUpUser(signUpUserDTO: SignUpUserDTO) {
    const existingUser = await this.userRepository.findOne({
      phoneNumber: signUpUserDTO.phoneNumber,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(signUpUserDTO.password, 10);
    const user = await this.userRepository.$transaction(async (tx) => {
      const user = await this.userRepository.create(
        {
          ...signUpUserDTO,
          password: hashedPassword,
        },
        tx,
      );

      await this.walletRepository.create({ userId: user.id }, tx);
      return user;
    });

    return user;
  }

  async authUser(signInUserDTO: SignInUserDTO) {
    const { phoneNumber, password } = signInUserDTO;
    const existingUser = await this.userRepository.findOne({
      phoneNumber,
    });
    if (!existingUser) {
      throw new UnauthorizedException('Invalid email address or password');
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect)
      throw new UnauthorizedException('Invalid email address or password');

    const payload = {
      userId: existingUser.id,
      phoneNumber: existingUser.phoneNumber,
    };

    const accessToken = this.jwtService.sign(payload);
    return { user: { ...existingUser, password: undefined }, accessToken };
  }
}
