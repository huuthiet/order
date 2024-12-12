import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import {
  CreateSystemConfigDto,
  DeleteSystemConfigDto,
  GetSystemConfigQueryDto,
  SystemConfigResponseDto,
  UpdateSystemConfigDto,
} from './system-config.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppResponseDto } from 'src/app/app.dto';
import { HasRoles } from 'src/role/roles.decorator';
import { RoleEnum } from 'src/role/role.enum';

@ApiBearerAuth()
@ApiTags('System config')
@Controller('system-config')
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @HasRoles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Manager)
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'System config key created successfully',
    type: SystemConfigResponseDto,
  })
  @ApiOperation({ summary: 'Create a new system config' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createSystemConfigDto: CreateSystemConfigDto,
  ) {
    const result = await this.systemConfigService.create(createSystemConfigDto);
    return {
      message: 'System config have been created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<SystemConfigResponseDto>;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @HasRoles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Manager)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'System config key retrieved successfully',
    type: SystemConfigResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Retrieve list of system configs' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findAll() {
    const result = await this.systemConfigService.findAll();
    return {
      message: 'System config have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<SystemConfigResponseDto[]>;
  }

  @Get('specific')
  @HttpCode(HttpStatus.OK)
  @HasRoles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Manager)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'System config key retrieved successfully',
    type: SystemConfigResponseDto,
  })
  @ApiOperation({ summary: 'Retrieve single system config' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async findOne(
    @Query(new ValidationPipe({ transform: true }))
    query: GetSystemConfigQueryDto,
  ) {
    const result = await this.systemConfigService.findOne(query);
    return {
      message: 'System config have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<SystemConfigResponseDto>;
  }

  @Patch(':slug')
  @HttpCode(HttpStatus.OK)
  @HasRoles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Manager)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'System config updated successfully',
    type: SystemConfigResponseDto,
  })
  @ApiOperation({ summary: 'System config updated successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async update(
    @Param('slug') slug: string,
    @Body(new ValidationPipe({ transform: true }))
    updateSystemConfigDto: UpdateSystemConfigDto,
  ) {
    const result = await this.systemConfigService.update(
      slug,
      updateSystemConfigDto,
    );
    return {
      message: 'System config have been updated successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<SystemConfigResponseDto>;
  }

  @Delete()
  @HasRoles(RoleEnum.SuperAdmin, RoleEnum.Admin, RoleEnum.Manager)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'System config deleted successfully',
    type: SystemConfigResponseDto,
  })
  @ApiOperation({ summary: 'System config deleted successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async remove(
    @Body(new ValidationPipe({ transform: true }))
    requestData: DeleteSystemConfigDto,
  ) {
    const result = await this.systemConfigService.remove(requestData);
    return {
      message: 'System config have been deleted successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<SystemConfigResponseDto>;
  }
}
