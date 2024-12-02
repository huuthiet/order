import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';
import { GoogleDriveService } from './google-drive.service';

@Module({
  controllers: [DbController],
  providers: [DbService, GoogleDriveService],
})
export class DbModule {}
