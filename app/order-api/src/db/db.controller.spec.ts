import { Test, TestingModule } from '@nestjs/testing';
import { DbController } from './db.controller';
import { DbService } from './db.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { GoogleDriveService } from './google-drive.service';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { SystemConfig } from 'src/system-config/system-config.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryMockFactory } from 'src/test-utils/repository-mock.factory';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';

describe('DbController', () => {
  let controller: DbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DbController],
      providers: [
        DbService,
        GoogleDriveService,
        SystemConfigService,
        {
          provide: getRepositoryToken(SystemConfig),
          useFactory: repositoryMockFactory,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console, // Mock logger (or a custom mock)
        },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useValue: mapperMockFactory,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SALT_ROUNDS') {
                return 10;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<DbController>(DbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
