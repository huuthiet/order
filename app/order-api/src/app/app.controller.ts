import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from 'src/auth/public.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController(true)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
