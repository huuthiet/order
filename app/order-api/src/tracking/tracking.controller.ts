import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TrackingService } from "./tracking.service";
import { ApiResponseWithType } from "src/app/app.decorator";
import { CreateTrackingRequestDto, TrackingResponseDto } from "./tracking.dto";
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
}