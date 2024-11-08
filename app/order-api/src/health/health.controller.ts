import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/auth/public.decorator';

@Controller('health')
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
          'nestjs-docs',
          'https://docs.nestjs.com',
        ),
    ]);
  }
}
