import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LoginAuthRequestDto, LoginAuthResponseDto } from './auth.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppResponseDto } from 'src/app/app.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponseWithType({
    type: LoginAuthResponseDto,
    description: 'Login successful',
  })
  async login(
    @Body(ValidationPipe)
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

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  getProfile(@Request() req) {
    return req.user;
  }
}
