import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ACBConnectorConfig } from './acb-connector.entity';
import { Repository } from 'typeorm';
import {
  ACBConnectorConfigResponseDto,
  CreateACBConnectorConfigRequestDto,
  UpdateACBConnectorConfigRequestDto,
} from './acb-connector.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as _ from 'lodash';

@Injectable()
export class ACBConnectorService {
  constructor(
    @InjectRepository(ACBConnectorConfig)
    private readonly acbConnectorConfigRepository: Repository<ACBConnectorConfig>,
    @InjectMapper()
    private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async get() {
    const config = await this.acbConnectorConfigRepository.find({
      take: 1,
    });
    if (config.length === 0) {
      return null;
    }
    return this.mapper.map(
      _.first(config),
      ACBConnectorConfig,
      ACBConnectorConfigResponseDto,
    );
  }

  async create(requestData: CreateACBConnectorConfigRequestDto) {
    const context = `${ACBConnectorService.name}.${this.create.name}`;
    const hasConfig = await this.acbConnectorConfigRepository.find({ take: 1 });
    if (hasConfig.length > 0) {
      this.logger.error('ACB Config already exists', null, context);
      throw new BadRequestException('ACB Config already exists');
    }
    const config = this.mapper.map(
      requestData,
      CreateACBConnectorConfigRequestDto,
      ACBConnectorConfig,
    );
    this.acbConnectorConfigRepository.create(config);
    const createdConfig = await this.acbConnectorConfigRepository.save(config);
    return this.mapper.map(
      createdConfig,
      ACBConnectorConfig,
      ACBConnectorConfigResponseDto,
    );
  }

  async update(slug: string, requestData: UpdateACBConnectorConfigRequestDto) {
    const context = `${ACBConnectorService.name}.${this.update.name}`;
    const config = await this.acbConnectorConfigRepository.findOne({
      where: {
        slug,
      },
    });
    if (!config) {
      this.logger.error('ACB Config not found', null, context);
      throw new BadRequestException('ACB Config not found');
    }

    Object.assign(config, { ...requestData });
    await this.acbConnectorConfigRepository.save(config);
    this.logger.log('ACB Config updated successfully', context);

    return this.mapper.map(
      config,
      ACBConnectorConfig,
      ACBConnectorConfigResponseDto,
    );
  }
}
