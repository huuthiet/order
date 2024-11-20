import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthProfileResponseDto,
  AuthRefreshRequestDto,
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
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private saltOfRounds: number;
  private duration: number;
  private refeshableDuration: number;

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
    this.duration = this.configService.get<number>('DURATION');
    this.refeshableDuration = this.configService.get<number>(
      'REFRESHABLE_DURATION',
    );
  }

  /**
   *
   * @param {string} phonenumber
   * @param {string} pass
   * @returns {Promise<User|null>} User if found, null otherwise
   */
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

  private async generateToken(payload: any): Promise<LoginAuthResponseDto> {
    return {
      accessToken: this.jwtService.sign(payload),
      expireTime: moment().add(this.duration, 'seconds').toString(),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.refeshableDuration,
      }),
      expireTimeRefreshToken: moment()
        .add(this.refeshableDuration, 'seconds')
        .toString(),
    };
  }

  /**
   *
   * @param {LoginAuthRequestDto} loginAuthDto
   * @returns {Promise<LoginAuthResponseDto>} Access token
   * @throws {UnauthorizedException} Invalid credentials
   */
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

    const payload = { sub: user.id, jti: uuidv4(), scope: '[]' };
    this.logger.log(
      `User ${user.phonenumber} logged in`,
      `${AuthService.name}.${this.login.name}`,
    );
    return this.generateToken(payload);
  }

  /**
   *
   * @param {RegisterAuthRequestDto} requestData
   * @returns {Promise<RegisterAuthResponseDto>} User registered successfully
   * @throws {AuthException} User already exists
   */
  async register(
    requestData: RegisterAuthRequestDto,
  ): Promise<RegisterAuthResponseDto> {
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

  /**
   *
   * @param {string} userId
   * @returns {Promise<AuthProfileResponseDto>} User profile
   * @throws {AuthException} User not found
   */
  async getProfile({
    userId,
  }: {
    userId: string;
    phonenumber: string;
  }): Promise<AuthProfileResponseDto> {
    const context = `${AuthService.name}.${this.getProfile.name}`;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User ${userId} not found`, context);
      throw new AuthException(AuthValidation.USER_NOT_FOUND);
    }
    return this.mapper.map(user, User, AuthProfileResponseDto);
  }

  async refresh(
    requestData: AuthRefreshRequestDto,
  ): Promise<LoginAuthResponseDto> {
    const context = `${AuthService.name}.${this.refresh.name}`;
    // TODO: Validate access token
    let isExpiredAccessToken = false;
    try {
      this.jwtService.verify(requestData.accessToken);
    } catch (error) {
      isExpiredAccessToken = true;
    }
    if (!isExpiredAccessToken) {
      this.logger.warn(`Access token is not expired`, context);
      throw new UnauthorizedException();
    }

    // TODO: Validate refresh token
    let isExpiredRefreshToken = false;
    try {
      this.jwtService.verify(requestData.refreshToken);
    } catch (error) {
      isExpiredRefreshToken = true;
    }
    if (isExpiredRefreshToken) {
      this.logger.warn(`Refresh token is expired`, context);
      throw new UnauthorizedException();
    }

    // TODO: Generate new access token
    const payload = this.jwtService.decode(requestData.refreshToken);
    this.logger.log(`User ${payload.sub} refreshed token`, context);

    return this.generateToken(payload);
  }
}
