import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { drive_v3, google } from 'googleapis';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as path from 'path';
import { SystemConfigKey } from 'src/system-config/system-config.constant';
import { SystemConfigService } from 'src/system-config/system-config.service';

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    private readonly systemConfigService: SystemConfigService,
  ) {
    this.authorize();
  }

  async getFolderId() {
    const context = `${GoogleDriveService.name}.${this.getFolderId.name}`;
    const folderId = await this.systemConfigService.get(
      SystemConfigKey.FOLDER_ID,
    );
    this.logger.log(`Folder Id: ${folderId}`, context);
    return folderId;
  }

  /**
   * Authorize with service account and get jwt client
   *
   */
  async authorize() {
    const keyPath = path.resolve('public/json/credentials.json');
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(filename: string, mimeType: string) {
    const context = `${GoogleDriveService.name}.${this.uploadFile.name}`;
    try {
      const file = await this.drive.files.create({
        media: {
          body: createReadStream(filename),
          mimeType: mimeType,
        },
        fields: 'id',
        requestBody: {
          name: path.basename(filename),
          parents: [await this.getFolderId()],
        },
      });
      // 1PQRLjknvtPAYsY8nBScIBnXKkZfytEp-
      this.logger.log(`File uploaded: ${path.basename(filename)}`, context);
      return file.data.id;
    } catch (err) {
      this.logger.error(
        `Error uploading file: ${JSON.stringify(err)}`,
        context,
      );
      throw new BadRequestException(`Error uploading file: ${err.message}`);
    }
  }
}
