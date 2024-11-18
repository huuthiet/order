import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import * as express from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { BranchService } from './branch.service';
import { BranchResponseDto, CreateBranchDto } from './branch.dto';
import { Public } from 'src/auth/public.decorator';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('branch')
@ApiBearerAuth()
@ApiTags('Branch')
export class BranchController {
  constructor(private branchService: BranchService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new branch' })
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'The new branch was created successfully',
    type: BranchResponseDto,
  })
  async createBranch(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    requestData: CreateBranchDto,
  ) {
    const result = await this.branchService.createBranch(requestData);
    return {
      message: 'The new branch was created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<BranchResponseDto>;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all branch' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'All branchs have been retrieved successfully',
    type: BranchResponseDto,
    isArray: true,
  })
  @Public()
  async getAllBranchs() {
    const result = await this.branchService.getAllBranchs();
    return {
      message: 'All branchs have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<BranchResponseDto[]>;
  }
}
