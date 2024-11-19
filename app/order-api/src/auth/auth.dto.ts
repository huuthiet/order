import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  INVALID_FIRSTNAME,
  INVALID_LASTNAME,
  INVALID_PASSWORD,
  INVALID_PHONENUMBER,
} from './auth.validation';
import { AutoMap } from '@automapper/classes';

export class LoginAuthRequestDto {
  @ApiProperty({ example: '08123456789' })
  @IsNotEmpty({ message: INVALID_PHONENUMBER })
  @AutoMap()
  phonenumber: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty({
    message: INVALID_PASSWORD,
  })
  @AutoMap()
  password: string;
}

export class RegisterAuthRequestDto extends LoginAuthRequestDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: INVALID_FIRSTNAME })
  @AutoMap()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: INVALID_LASTNAME })
  @AutoMap()
  lastName: string;
}

export class LoginAuthResponseDto {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;

  @ApiProperty()
  readonly expireTime: string;

  @ApiProperty()
  readonly expireTimeRefreshToken: string;
}

export class AuthRefreshRequestDto {
  @ApiProperty()
  @AutoMap()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  refreshToken: string;
}

export class AuthProfileResponseDto {
  @AutoMap()
  @ApiProperty()
  readonly slug: string;

  @ApiProperty()
  @AutoMap()
  readonly phonenumber: string;

  @ApiProperty()
  @AutoMap()
  readonly firstName: string;

  @ApiProperty()
  @AutoMap()
  readonly lastName: string;

  @AutoMap()
  @ApiProperty()
  readonly dob: string;

  @AutoMap()
  @ApiProperty()
  readonly email: string;

  @AutoMap()
  @ApiProperty()
  readonly address: string;
}

// PickType: Get the fields from AuthProfileResponseDto
export class RegisterAuthResponseDto extends PickType(AuthProfileResponseDto, [
  'slug',
  'phonenumber',
  'firstName',
  'lastName',
] as const) {}
