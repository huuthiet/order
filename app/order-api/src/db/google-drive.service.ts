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

@Injectable()
export class GoogleDriveService {
  private drive: drive_v3.Drive;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {
    this.authorize();
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
    try {
      const file = await this.drive.files.create({
        media: {
          body: createReadStream(filename),
          mimeType: mimeType,
        },
        fields: 'id',
        requestBody: {
          name: path.basename(filename),
          parents: ['1PQRLjknvtPAYsY8nBScIBnXKkZfytEp-'],
        },
      });
      this.logger.log(`File uploaded: ${path.basename(filename)}`);
      return file.data.id;
    } catch (err) {
      this.logger.error(`Error uploading file: ${JSON.stringify(err)}`);
      throw new BadRequestException('Error uploading file');
    }
  }
}
