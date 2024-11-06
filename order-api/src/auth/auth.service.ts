import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginAuthRequestDto, LoginAuthResponseDto } from './auth.dto';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private loggerService: LoggerService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    loginAuthDto: LoginAuthRequestDto,
  ): Promise<LoginAuthResponseDto> {
    const user = await this.validateUser(
      loginAuthDto.phonenumber,
      loginAuthDto.password,
    );
    if (!user) throw new UnauthorizedException();

    const payload = { username: user.username, sub: user.userId };
    this.loggerService.log(`User ${user.username} logged in`);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
