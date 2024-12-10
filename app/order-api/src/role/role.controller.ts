import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { RoleResponseDto } from './role.dto';
import { AppResponseDto } from 'src/app/app.dto';

@ApiTags('Role')
@Controller('role')
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all roles' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'All roles have been retrieved successfully',
    type: RoleResponseDto,
    isArray: true,
  })
  async findAll() {
    const result = await this.roleService.findAll();
    return {
      message: 'All roles have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<RoleResponseDto[]>;
  }
}
