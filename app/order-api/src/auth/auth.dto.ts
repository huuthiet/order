import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: INVALID_FIRSTNAME })
  @AutoMap()
  firstName: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: INVALID_LASTNAME })
  @AutoMap()
  lastName: string;
}

export class LoginAuthResponseDto {
  @ApiProperty()
  readonly accessToken: string;

  // @ApiProperty()
  // readonly refreshToken: string;
}

export class RegisterAuthResponseDto {
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
}
