import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthProfileResponseDto,
  LoginAuthRequestDto,
  LoginAuthResponseDto,
  RegisterAuthRequestDto,
  RegisterAuthResponseDto,
} from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthException } from './auth.exception';
import AuthValidation from './auth.validation';

@Injectable()
export class AuthService {
  private saltOfRounds: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectMapper()
    private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {
    this.saltOfRounds = this.configService.get<number>('SALT_ROUNDS');
  }

  async validateUser(phonenumber: string, pass: string): Promise<User | null> {
    const context = `${AuthService.name}.${this.validateUser.name}`;
    const user = await this.userRepository.findOne({ where: { phonenumber } });
    if (!user) {
      this.logger.warn(`User ${phonenumber} not found`, `${context}`);
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      this.logger.warn(
        `User ${phonenumber} provided invalid password`,
        context,
      );
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
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { phonenumber: user.phonenumber, sub: user.id };
    this.logger.log(
      `User ${user.phonenumber} logged in`,
      `${AuthService.name}.${this.login.name}`,
    );
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(requestData: RegisterAuthRequestDto) {
    const context = `${AuthService.name}.${this.register.name}`;
    // Validation
    const userExists = await this.userRepository.findOne({
      where: {
        phonenumber: requestData.phonenumber,
      },
    });
    if (userExists) {
      this.logger.warn(
        `User ${requestData.phonenumber} already exists`,
        context,
      );
      throw new AuthException(AuthValidation.USER_EXISTS);
    }

    const user = this.mapper.map(requestData, RegisterAuthRequestDto, User);
    this.logger.warn(`Salt of rounds: ${this.saltOfRounds}`, context);
    user.password = await bcrypt.hash(requestData.password, this.saltOfRounds);

    this.userRepository.create(user);
    await this.userRepository.save(user);
    this.logger.warn(`User ${requestData.phonenumber} registered`, context);
    return this.mapper.map(user, User, RegisterAuthResponseDto);
  }

  async getProfile({ userId }: { userId: string; phonenumber: string }) {
    const context = `${AuthService.name}.${this.getProfile.name}`;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User ${userId} not found`, context);
      throw new AuthException(AuthValidation.USER_NOT_FOUND);
    }
    return this.mapper.map(user, User, AuthProfileResponseDto);
  }
}
