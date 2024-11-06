import { IsNotEmpty } from 'class-validator';

export class LoginAuthRequestDto {
  @IsNotEmpty({ message: 'Phone number is required' })
  phonenumber: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
}

export class LoginAuthResponseDto {
  accessToken: string;
}
