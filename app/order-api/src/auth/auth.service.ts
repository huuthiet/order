import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthRequestDto, LoginAuthResponseDto } from './auth.dto';
import { LoggerService } from 'src/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new LoggerService(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(phonenumber: string, pass: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { phonenumber } });
    if (!user) {
      this.logger.warn(`User ${phonenumber} not found`);
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      this.logger.warn(`User ${phonenumber} provided invalid password`);
      return null;
    }
    return user;
  }

  async login(
    loginAuthDto: LoginAuthRequestDto,
  ): Promise<LoginAuthResponseDto> {
    const user = await this.validateUser(
      loginAuthDto.phonenumber,
      loginAuthDto.password,
    );
    if (!user) throw new UnauthorizedException();

    const payload = { phonenumber: user.phonenumber, sub: user.slug };
    this.logger.warn(`User ${user.phonenumber} logged in`);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
