import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BranchRevenueService } from './branch-revenue.service';
import { HasRoles } from 'src/role/roles.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { ApiResponseWithType } from 'src/app/app.decorator';
import {
  BranchRevenueResponseDto,
  GetBranchRevenueQueryDto,
} from './branch-revenue.dto';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('revenue/branch')
@ApiTags('Branch Revenue')
@ApiBearerAuth()
export class BranchRevenueController {
  constructor(private readonly branchRevenueService: BranchRevenueService) {}

  @Get(':branch')
  @HasRoles(
    RoleEnum.Staff,
    RoleEnum.Chef,
    RoleEnum.Manager,
    RoleEnum.Admin,
    RoleEnum.SuperAdmin,
  )
  @ApiOperation({ summary: 'Get all branch revenues' })
  @ApiResponseWithType({
    type: BranchRevenueResponseDto,
    isArray: true,
    status: HttpStatus.OK,
    description: 'The branch revenues retrieved successfully',
  })
  async findAll(
    @Param('branch') branch: string,
    @Query(new ValidationPipe({ transform: true }))
    query: GetBranchRevenueQueryDto,
  ) {
    const result = await this.branchRevenueService.findAll(branch, query);
    return {
      message: 'The branch revenues have been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<BranchRevenueResponseDto[]>;
  }
}
