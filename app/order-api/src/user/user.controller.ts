import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppPaginatedResponseDto, AppResponseDto } from 'src/app/app.dto';
import {
  GetAllUserQueryRequestDto,
  ResetPasswordRequestDto,
  UpdateUserRoleRequestDto,
  UserResponseDto,
} from './user.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { HasRoles } from 'src/role/roles.decorator';
import { RoleEnum } from 'src/role/role.enum';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HasRoles(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all user' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'All users have been retrieved successfully',
    type: UserResponseDto,
    isArray: true,
  })
  async getAllUsers(
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllUserQueryRequestDto,
  ): Promise<AppResponseDto<AppPaginatedResponseDto<UserResponseDto>>> {
    const result = await this.userService.getAllUsers(query);
    return {
      message: 'All users have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<AppPaginatedResponseDto<UserResponseDto>>;
  }

  @Post('/reset-password')
  @HasRoles(RoleEnum.Manager, RoleEnum.Admin, RoleEnum.SuperAdmin)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset pwd' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'User password has been reset successfully',
    type: UserResponseDto,
  })
  async resetPassword(
    @Query(new ValidationPipe({ transform: true }))
    requestData: ResetPasswordRequestDto,
  ): Promise<AppResponseDto<UserResponseDto>> {
    const result = await this.userService.resetPassword(requestData);
    return {
      message: 'User password has been reset successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    } as AppResponseDto<UserResponseDto>;
  }

  async updateUserRole(
    @Body(new ValidationPipe({ transform: true }))
    requestData: UpdateUserRoleRequestDto,
  ) {
    const result = await this.userService.updateUserRole(requestData);
    return {
      message: 'User role has been updated successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<UserResponseDto>;
  }
}
