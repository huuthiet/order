import { Controller, Post, HttpStatus } from '@nestjs/common';
import { DbService } from './db.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('db')
@ApiTags('Database')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Post()
  @Public()
  async backup(): Promise<AppResponseDto<string>> {
    const result = await this.dbService.backup();
    return {
      message: `SQL ${result} uploaded successfully`,
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
    } as AppResponseDto<string>;
  }
}
