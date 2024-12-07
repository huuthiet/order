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
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { RoleResponseDto } from './role.dto';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('role')
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roleService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.roleService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleService.remove(+id);
  // }
}
