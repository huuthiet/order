import { Test, TestingModule } from '@nestjs/testing';
import { DbController } from './db.controller';
import { DbService } from './db.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { GoogleDriveService } from './google-drive.service';

describe('DbController', () => {
  let controller: DbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DbController],
      providers: [
        DbService,
        GoogleDriveService,
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console, // Mock logger (or a custom mock)
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
