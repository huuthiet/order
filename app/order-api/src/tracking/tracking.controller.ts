import { Body, Controller, HttpCode, HttpStatus, Param, Patch, Post, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";
import { ApiResponseWithType } from "src/app/app.decorator";
import { ChangeStatusRequestDto, CreateTrackingRequestDto, TrackingResponseDto } from "./tracking.dto";
import { AppResponseDto } from "src/app/app.dto";
import { Public } from "src/auth/public.decorator";

@ApiTags('Tracking')
@Controller('trackings')
@ApiBearerAuth()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Public()
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'Create a new tracking successfully',
    type: TrackingResponseDto,
  })
  @ApiOperation({ summary: 'Create a new tracking' })
  @ApiResponse({ status: 200, description: 'Create tracking successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createTracking(
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
    }))
    requestData: CreateTrackingRequestDto,
  ) {
    const result = await this.trackingService.createTracking(requestData);
    return {
      message: 'Tracking have been created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<TrackingResponseDto>;
  }

  @Patch(':slug')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Update size successfully',
    type: TrackingResponseDto,
  })
  @ApiOperation({ summary: 'Update size' })
  @ApiResponse({ status: 200, description: 'Update size successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the tracking to be updated',
    required: true,
    example: '',
  })
  async updateSize(
    @Param('slug') slug: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    updateSizeDto: ChangeStatusRequestDto,
  ) {
    const result = await this.trackingService.changeStatus(slug, updateSizeDto.status);
    return {
      message: 'The tracking have been updated successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<TrackingResponseDto>;
  }
}