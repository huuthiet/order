import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginAuthRequestDto {
  @ApiProperty({ example: '08123456789' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phonenumber: string;

  @ApiProperty({ example: 'password' })
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
}

export class LoginAuthResponseDto {
  @ApiProperty()
  readonly accessToken: string;

  // @ApiProperty()
  // readonly refreshToken: string;
}
