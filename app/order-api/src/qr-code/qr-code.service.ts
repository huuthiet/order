import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  async generateQRCode(data: string) {
    const qrCode = await QRCode.toDataURL(data);
    return qrCode;
  }
}
