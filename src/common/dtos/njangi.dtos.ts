import {
  IsEnum,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NjangiDurationEnum, NjangiInviteStatusEnum } from '../enums';

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

  @IsString()
  @IsEnum(NjangiDurationEnum)
  @IsNotEmpty()
  duration: NjangiDurationEnum;
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
  @IsEnum(NjangiInviteStatusEnum)
  status: 'pending' | 'accepted' | 'ignored';
}
