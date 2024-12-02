import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { drive_v2, google } from 'googleapis';
import * as path from 'path';

@Injectable()
export class GoogleDriveService {
  //   private readonly clientEmail = this.configService.get<string>(
  //     'GOOGLE_CLIENT_EMAIL',
  //   );
  //   private readonly privateKey =
  //     this.configService.get<string>('GOOGLE_PRIVATE_KEY');

  private drive: drive_v2.Drive;

  constructor(private readonly configService: ConfigService) {
    this.authorize();
  }

  /**
   * Authorize with service account and get jwt client
   *
   */
  async authorize() {
    const keyPath = path.resolve('public/json/credentials.json'); // Path to your JSON credentials
    const auth = new google.auth.GoogleAuth({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.drive = google.drive({ version: 'v2', auth });
  }

  async uploadFile(filename: string, mimeType: string) {
    const file = await this.drive.files.insert({
      media: {
        body: createReadStream(filename),
        mimeType: mimeType,
      },
      fields: 'id',
      requestBody: {},
    });

    return file.data.id;
  }
}
