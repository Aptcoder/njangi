import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NjangiInviteStatus } from '../constants';

export class CreateNjangiDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsInt()
  @IsOptional()
  maxUser?: number;
}

export class CreateNjangiInviteDTO {
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone(null, {
    strictMode: true,
  })
  phoneNumber: string;
}

export class UpdateNjangiInviteDTO {
  @IsString()
  @IsNotEmpty()
  @IsEnum(NjangiInviteStatus)
  status: 'pending' | 'accepted' | 'ignored';
}
