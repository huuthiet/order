import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginAuthRequestDto,
  LoginAuthResponseDto,
  RegisterAuthRequestDto,
  RegisterAuthResponseDto,
} from './auth.dto';
import { LoggerService } from 'src/logger/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@Injectable()
export class AuthService {
  private logger: Logger;
  private saltOfRounds: number;
  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {
    this.saltOfRounds = this.configService.get<number>('SALT_ROUNDS');
    this.logger = new Logger(AuthService.name);
  }

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

  async register(requestData: RegisterAuthRequestDto) {
    // Validation
    const userExists = await this.userRepository.findOne({
      where: {
        phonenumber: requestData.phonenumber,
      },
    });
    if (userExists) {
      this.logger.warn(`User ${requestData.phonenumber} already exists`);
      throw new UnauthorizedException();
    }

    const user = this.mapper.map(requestData, RegisterAuthRequestDto, User);
    this.logger.warn(`Salt of rounds: ${this.saltOfRounds}`);
    user.password = await bcrypt.hash(requestData.password, this.saltOfRounds);

    this.userRepository.create(user);
    await this.userRepository.save(user);
    this.logger.warn(`User ${requestData.phonenumber} registered`);
    return this.mapper.map(user, User, RegisterAuthResponseDto);
  }
}
