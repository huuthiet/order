import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import {
  AuthProfileResponseDto,
  AuthRefreshRequestDto,
  LoginAuthRequestDto,
  LoginAuthResponseDto,
  RegisterAuthRequestDto,
  RegisterAuthResponseDto,
  UpdateAuthProfileRequestDto,
} from './auth.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppResponseDto } from 'src/app/app.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { User, UserRequest } from './user.decorator';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponseWithType({
    type: LoginAuthResponseDto,
    description: 'Login successful',
  })
  async login(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    requestData: LoginAuthRequestDto,
  ): Promise<AppResponseDto<LoginAuthResponseDto>> {
    const result = await this.authService.login(requestData);
    const response = {
      message: 'Login successful',
      status: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as unknown as AppResponseDto<LoginAuthResponseDto>;
    return response;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register account' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponseWithType({
    type: RegisterAuthResponseDto,
    description: 'Register successful',
  })
  async register(
    @Body(new ValidationPipe({ transform: true }))
    requestData: RegisterAuthRequestDto,
  ) {
    const result = await this.authService.register(requestData);
    const response = {
      message: 'Registration successful',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<RegisterAuthResponseDto>;
    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @ApiOperation({ summary: 'Get profile' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponseWithType({
    type: AuthProfileResponseDto,
    description: 'Profile retrieved successful',
  })
  async getProfile(
    @User(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserRequest,
  ): Promise<AppResponseDto<AuthProfileResponseDto>> {
    const result = await this.authService.getProfile(user);
    return {
      message: 'Profile retrieved successfully',
      status: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as unknown as AppResponseDto<AuthProfileResponseDto>;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  @ApiOperation({ summary: 'Update profile' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponseWithType({
    type: AuthProfileResponseDto,
    description: 'Profile updated successfully',
  })
  async updateProfile(
    @User(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserRequest,
    @Body(new ValidationPipe({ transform: true }))
    requestData: UpdateAuthProfileRequestDto,
  ): Promise<AppResponseDto<AuthProfileResponseDto>> {
    const result = await this.authService.updateProfile(user, requestData);
    return {
      message: 'Profile retrieved successfully',
      status: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as unknown as AppResponseDto<AuthProfileResponseDto>;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponseWithType({
    type: LoginAuthResponseDto,
    description: 'User refreshed token successfully',
  })
  @Public()
  async refresh(
    @Body(new ValidationPipe({ transform: true }))
    requestData: AuthRefreshRequestDto,
  ): Promise<AppResponseDto<LoginAuthResponseDto>> {
    const result = await this.authService.refresh(requestData);
    return {
      message: 'User refreshed token successfully',
      status: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as unknown as AppResponseDto<LoginAuthResponseDto>;
  }
}
