import { Controller, Post, HttpStatus } from '@nestjs/common';
import { DbService } from './db.service';
import { ApiTags } from '@nestjs/swagger';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('db')
@ApiTags('Database')
export class DbController {
  constructor(private readonly dbService: DbService) {}

  @Post()
  async backup(): Promise<AppResponseDto<string>> {
    const result = await this.dbService.backup();
    return {
      message: `Sql ${result} file uploaded successfully`,
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
    } as AppResponseDto<string>;
  }
}
