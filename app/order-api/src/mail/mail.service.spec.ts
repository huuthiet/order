import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MailerService } from '@nestjs-modules/mailer';
import { MailProducer } from './mail.producer';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        MailProducer,
        { provide: 'BullQueue_mail', useValue: {} },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console, // Mock logger (or a custom mock)
        },
        {
          provide: 'MAILER_OPTIONS',
          useValue: {},
        },
        { provide: MailerService, useValue: {} },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
