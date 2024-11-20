import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Healthcheck')
@Controller('health')
@ApiExcludeController(true)
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private httpHealthIndicator: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  check() {
    return this.healthCheckService.check([
      () =>
        this.httpHealthIndicator.pingCheck(
          'order-api',
          'http://localhost:8080/api/v1.0.0/hello',
        ),
    ]);
  }
}
