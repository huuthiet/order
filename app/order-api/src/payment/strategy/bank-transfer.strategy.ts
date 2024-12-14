import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
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
import { ACBInitiateQRCodeRequestDto } from 'src/acb-connector/acb-connector.dto';
import * as shortid from 'shortid';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Payment } from '../payment.entity';
import { PaymentMethod, PaymentStatus } from '../payment.constants';
import { formatMoment } from 'src/helper';

@Injectable()
export class BankTransferStrategy implements IPaymentStrategy {
  private readonly clientId: string =
    this.configService.get<string>('ACB_CLIENT_ID');
  private readonly clientSecret: string =
    this.configService.get<string>('ACB_CLIENT_SECRET');

  constructor(
    private readonly acbConnectorClient: ACBConnectorClient,
    private readonly configService: ConfigService,
    @InjectRepository(ACBConnectorConfig)
    private readonly acbConnectorConfigRepository: Repository<ACBConnectorConfig>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async process(order: Order): Promise<Payment> {
    const context = `${BankTransferStrategy.name}.${this.process.name}`;
    const acbConnectorConfig = await this.acbConnectorConfigRepository.find({
      take: 1,
    });
    if (_.isEmpty(acbConnectorConfig)) {
      this.logger.error('ACB Connector config not found', null, context);
      throw new BadRequestException('ACB Connector config not found');
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
      [X_OWNER_NUMBER]: acbConnectorConfig[0]?.xOwnerNumber,
      [X_OWNER_TYPE]: acbConnectorConfig[0]?.xOwnerType,
      [X_PROVIDER_ID]: acbConnectorConfig[0]?.xProviderId,
      [X_REQUEST_ID]: uuidv4(),
    };

    // Convert date to with format: yyyy-MM-ddTHH:mm:ss.SSSZ
    // example: 2024-11-09T11:03:33.033+0700
    const requestDateTime = formatMoment();
    this.logger.log(`Request date time: ${requestDateTime}`, context);

    const requestData = {
      requestDateTime: requestDateTime,
      requestTrace: requestTrace,
      requestParameters: {
        traceNumber: requestTrace,
        amount: order.subtotal,
        beneficiaryName: acbConnectorConfig[0]?.beneficiaryName,
        merchantId: shortid(),
        orderId: order.slug,
        terminalId: shortid(),
        userId: order.owner.id,
        loyaltyCode: shortid(),
        virtualAccountPrefix: acbConnectorConfig[0]?.virtualAccountPrefix,
        voucherCode: shortid(),
        description: 'hoa don thanh toan',
      },
    } as ACBInitiateQRCodeRequestDto;

    this.logger.warn(
      `Initiate QR Code request: ${JSON.stringify(requestData)}`,
      context,
    );

    const response = await this.acbConnectorClient.initiateQRCode(
      headers,
      requestData,
      access_token,
    );
    this.logger.log(`Initiate QR Code success`, context);

    this.logger.warn(
      `Initiate QR Code response: ${JSON.stringify(response)}`,
      context,
    );
    // Create payment
    const payment = {
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      amount: order.subtotal,
      message: requestData.requestParameters?.description,
      transactionId: response.requestTrace,
      qrCode: response.responseBody?.qrDataUrl,
      userId: order.owner.id,
      statusCode: PaymentStatus.PENDING,
      statusMessage: PaymentStatus.PENDING,
    } as Payment;

    this.paymentRepository.create(payment);
    return await this.paymentRepository.save(payment);
  }
}
