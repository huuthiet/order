import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthChangePasswordRequestDto,
  AuthJwtPayload,
  AuthProfileResponseDto,
  AuthRefreshRequestDto,
  ForgotPasswordRequestDto,
  ForgotPasswordTokenRequestDto,
  LoginAuthRequestDto,
  LoginAuthResponseDto,
  RegisterAuthRequestDto,
  RegisterAuthResponseDto,
  UpdateAuthProfileRequestDto,
} from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthException } from './auth.exception';
import {
  AuthValidation,
  FORGOT_TOKEN_EXPIRED,
  INVALID_OLD_PASSWORD,
} from './auth.validation';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Branch } from 'src/branch/branch.entity';
import { BranchValidation } from 'src/branch/branch.validation';
import { BranchException } from 'src/branch/branch.exception';
import { FileService } from 'src/file/file.service';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordToken } from './forgot-password-token.entity';
import { USER_NOT_FOUND } from './auth.validation1';
import { CurrentUserDto } from 'src/user/user.dto';
import { Role } from 'src/role/role.entity';
import { RoleEnum } from 'src/role/role.enum';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { SystemConfigKey } from 'src/system-config/system-config.constant';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  private saltOfRounds: number;
  private duration: number;
  private refeshableDuration: number;
  private frontedUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectMapper()
    private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @InjectRepository(ForgotPasswordToken)
    private readonly forgotPasswordRepository: Repository<ForgotPasswordToken>,
    private readonly fileService: FileService,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
    private readonly systemConfigService: SystemConfigService,
  ) {
    this.saltOfRounds = this.configService.get<number>('SALT_ROUNDS');
    this.duration = this.configService.get<number>('DURATION');
    this.refeshableDuration = this.configService.get<number>(
      'REFRESHABLE_DURATION',
    );
  }

  async getFrontendUrl() {
    return await this.systemConfigService.get(SystemConfigKey.FRONTEND_URL);
  }

  async forgotPassword(requestData: ForgotPasswordRequestDto) {
    const context = `${AuthService.name}.${this.forgotPassword.name}`;
    const existToken = await this.forgotPasswordRepository.findOne({
      where: {
        token: requestData.token,
        expiresAt: MoreThan(new Date()),
      },
    });
    if (!existToken) {
      this.logger.warn(`Forgot token is not exsited`, context);
      throw new AuthException(
        AuthValidation.FORGOT_TOKEN_EXPIRED,
        FORGOT_TOKEN_EXPIRED,
      );
    }

    // Verify token
    let isExpiredToken = false;
    try {
      this.jwtService.verify(requestData.token);
    } catch (error) {
      isExpiredToken = true;
    }
    if (isExpiredToken) {
      this.logger.warn(`Forgot token is expired`, context);
      throw new AuthException(
        AuthValidation.FORGOT_TOKEN_EXPIRED,
        FORGOT_TOKEN_EXPIRED,
      );
    }

    // Get payload
    const payload: AuthJwtPayload = this.jwtService.decode(requestData.token);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
    });
    if (!user)
      throw new AuthException(AuthValidation.USER_NOT_FOUND, USER_NOT_FOUND);

    const hashedPass = await bcrypt.hash(
      requestData.newPassword,
      this.saltOfRounds,
    );

    user.password = hashedPass;
    await this.userRepository.save(user);
    this.logger.log(`User ${user.id} has been updated password`, context);

    // Set token expired after forgot password successfully
    existToken.expiresAt = new Date(Date.now() - 1000); // Set expiry time to the past
    await this.forgotPasswordRepository.save(existToken);
    this.logger.log(`Token ${existToken.token} is expired`, context);

    return 0;
  }

  async createForgotPasswordToken(requestData: ForgotPasswordTokenRequestDto) {
    const context = `${AuthService.name}.${this.createForgotPasswordToken.name}`;
    const user = await this.userRepository.findOne({
      where: {
        email: requestData.email,
      },
    });
    if (!user) {
      this.logger.warn(`User ${requestData.email} not found`, context);
      throw new AuthException(AuthValidation.USER_NOT_FOUND, USER_NOT_FOUND);
    }

    const existingToken = await this.forgotPasswordRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        expiresAt: MoreThan(new Date()),
      },
    });

    if (existingToken) {
      this.logger.warn(`User ${user.id} already has a valid token`, context);
      throw new BadRequestException('A valid token already exists.');
    }

    const payload = { sub: user.id, jti: uuidv4() };
    const expiresIn = 120; // 2 minutes
    const token = this.jwtService.sign(payload, {
      expiresIn: expiresIn,
    });

    const forgotPasswordToken = new ForgotPasswordToken();
    Object.assign(forgotPasswordToken, {
      expiresAt: moment().add(expiresIn, 'seconds').toDate(),
      token,
      user,
    } as ForgotPasswordToken);

    const url = `${await this.getFrontendUrl()}/reset-password?token=${token}`;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(forgotPasswordToken);
      await this.mailService.sendForgotPasswordToken(user, url);
      await queryRunner.commitTransaction();
      this.logger.log(`User ${user.id} created forgot password token`, context);
      return url;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async uploadAvatar(user: CurrentUserDto, file: Express.Multer.File) {
    const context = `${AuthService.name}.${this.uploadAvatar.name}`;
    const userEntity = await this.userRepository.findOne({
      where: { id: user.userId },
    });

    // Delete old avatar
    await this.fileService.removeFile(userEntity.image);

    // Save new avatar
    const uploadedFile = await this.fileService.uploadFile(file);
    userEntity.image = uploadedFile.name;
    await this.userRepository.save(userEntity);
    this.logger.log(`User ${user.userId} uploaded avatar`, context);

    return this.mapper.map(userEntity, User, AuthProfileResponseDto);
  }

  async changePassword(
    user: CurrentUserDto,
    requestData: AuthChangePasswordRequestDto,
  ) {
    const context = `${AuthService.name}.${this.changePassword.name}`;
    const userEntity = await this.userRepository.findOne({
      where: { id: user.userId },
    });
    if (!userEntity) {
      this.logger.warn(`User ${user.userId} not found`, context);
      throw new AuthException(AuthValidation.USER_NOT_FOUND, USER_NOT_FOUND);
    }

    // Validate same old password
    const isMatch = await bcrypt.compare(
      requestData.oldPassword,
      userEntity.password,
    );
    if (!isMatch) {
      this.logger.warn(
        `User ${user.userId} provided invalid old password`,
        context,
      );
      throw new AuthException(
        AuthValidation.INVALID_OLD_PASSWORD,
        INVALID_OLD_PASSWORD,
      );
    }

    const hashedPass = await bcrypt.hash(
      requestData.newPassword,
      this.saltOfRounds,
    );
    userEntity.password = hashedPass;
    await this.userRepository.save(userEntity);
    this.logger.log(`User ${user.userId} changed password`, context);

    return this.mapper.map(userEntity, User, AuthProfileResponseDto);
  }

  /**
   * Update user profile
   * @param {CurrentUserDto} currentUserDto
   * @param {UpdateAuthProfileRequestDto} requestData
   * @returns {Promise<AuthProfileResponseDto>} Updated user profile
   * @throws {BranchException} Branch not found
   * @throws {AuthException} User not found
   */
  async updateProfile(
    currentUserDto: CurrentUserDto,
    requestData: UpdateAuthProfileRequestDto,
  ): Promise<AuthProfileResponseDto> {
    const context = `${AuthService.name}.${this.updateProfile.name}`;
    // Validation branch
    const branch = await this.branchRepository.findOne({
      where: { slug: requestData.branchSlug },
    });
    if (!branch) {
      this.logger.warn(`Branch ${requestData.branchSlug} not found`, context);
      throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
    }

    const user = await this.userRepository.findOne({
      where: { id: currentUserDto.userId },
    });
    if (!user) {
      this.logger.warn(`User ${user.id} not found`, context);
      throw new AuthException(AuthValidation.USER_NOT_FOUND, USER_NOT_FOUND);
    }

    Object.assign(user, {
      ...requestData,
      branch,
    });
    const updatedUser = await this.userRepository.save(user);
    this.logger.log(`User ${user.id} updated profile`, context);

    return this.mapper.map(updatedUser, User, AuthProfileResponseDto);
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

  private async generateToken(
    payload: AuthJwtPayload,
  ): Promise<LoginAuthResponseDto> {
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

    const payload: AuthJwtPayload = {
      sub: user.id,
      jti: uuidv4(),
      scope: '[]',
    };
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
    const branch = await this.branchRepository.findOne({
      where: {
        slug: requestData.branchSlug,
      },
    });
    if (!branch) {
      this.logger.warn(`Branch ${requestData.branchSlug} not found`, context);
      throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
    }

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

    const role = await this.roleRepository.findOne({
      where: {
        name: RoleEnum.Customer,
      },
    });
    if (!role)
      throw new BadRequestException(`Role ${RoleEnum.Customer} not found`);

    const user = this.mapper.map(requestData, RegisterAuthRequestDto, User);

    this.logger.warn(`Salt of rounds: ${this.saltOfRounds}`, context);
    const hashedPass = await bcrypt.hash(
      requestData.password,
      this.saltOfRounds,
    );

    Object.assign(user, { branch, password: hashedPass, role });
    this.userRepository.create(user);
    const createdUser = await this.userRepository.save(user);
    this.logger.warn(`User ${requestData.phonenumber} registered`, context);
    return this.mapper.map(createdUser, User, RegisterAuthResponseDto);
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
  }): Promise<AuthProfileResponseDto> {
    const context = `${AuthService.name}.${this.getProfile.name}`;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['branch', 'role'],
    });
    if (!user) {
      this.logger.error(`User ${userId} not found`, null, context);
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
