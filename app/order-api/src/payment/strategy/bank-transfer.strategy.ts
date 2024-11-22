import { Injectable } from '@nestjs/common';
import { Payment } from '../payment.entity';
import { IPaymentStrategy } from './payment.strategy';
import { ACBConnectorClient } from 'src/acb-connector/acb-connector.client';
import { ConfigService } from '@nestjs/config';
import { Order } from 'src/order/order.entity';
import {
  X_CLIENT_ID,
  X_OWNER_NUMBER,
  X_OWNER_TYPE,
  X_PROVIDER_ID,
  X_REQUEST_ID,
} from 'src/acb-connector/acb-connector.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { ACBConnectorConfig } from 'src/acb-connector/acb-connector.entity';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  ACBConnectorConfigResponseDto,
  ACBInitiateQRCodeRequestDto,
  ACBInitiateQRCodeResponseDto,
} from 'src/acb-connector/acb-connector.dto';
import * as shortid from 'shortid';
import * as moment from 'moment';
import { InitiatePaymentQRCodeResponseDto } from '../payment.dto';

@Injectable()
export class BankTransferStrategy implements IPaymentStrategy {
  private readonly clientId: string =
    this.configService.get<string>('CLIENT_ID');
  private readonly clientSecret: string =
    this.configService.get<string>('CLIENT_SECRET');

  constructor(
    private readonly acbConnectorClient: ACBConnectorClient,
    private readonly configService: ConfigService,
    @InjectRepository(ACBConnectorConfig)
    private readonly acbConnectorConfigRepository: Repository<ACBConnectorConfig>,
  ) {}

  async process(order: Order): Promise<InitiatePaymentQRCodeResponseDto> {
    const acbConnectorConfig = await this.acbConnectorConfigRepository.find({
      take: 1,
    });
    if (_.isEmpty(acbConnectorConfig)) {
      throw new Error('ACB Connector config not found');
    }
    // Get token from ACB
    const { access_token } = await this.acbConnectorClient.token({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
    });

    // Call ACB API to create payment
    const requestTrace = uuidv4();
    const headers = {
      [X_CLIENT_ID]: this.clientId,
      [X_OWNER_NUMBER]: acbConnectorConfig[0].xOwnerNumber,
      [X_OWNER_TYPE]: acbConnectorConfig[0].xOwnerType,
      [X_PROVIDER_ID]: acbConnectorConfig[0].xProviderId,
      [X_REQUEST_ID]: uuidv4(),
    };
    const requestData = {
      requestDateTime: moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      requestTrace: requestTrace,
      requestParameters: {
        amount: order.subtotal,
        beneficiaryName: acbConnectorConfig[0].beneficiaryName,
        merchantId: shortid(),
        orderId: order.id,
        terminalId: shortid(),
        traceNumber: requestTrace,
        userId: order.owner.id,
        loyaltyCode: shortid(),
        virtualAccountPrefix: acbConnectorConfig[0].virtualAccountPrefix,
        voucherCode: shortid(),
      },
    } as ACBInitiateQRCodeRequestDto;
    const response = await this.acbConnectorClient.initiateQRCode(
      headers,
      requestData,
      access_token,
    );
    return {
      requestTrace: response.requestTrace,
      qrCode: response.responseBody.qrDataUrl,
    } as InitiatePaymentQRCodeResponseDto;
  }
}
