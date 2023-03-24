import { IsNotEmpty, IsString, IsMobilePhone } from 'class-validator';

export class SignInUserDTO {
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone(null, {
    strictMode: true,
  })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
export class SignUpUserDTO extends SignInUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
