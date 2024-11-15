import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/logger/logger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { repositoryMockFactory } from 'src/test-utils/repository-mock.factory';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  const mapperProvider = 'automapper:nestjs:default';
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-token'),
          },
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
        {
          provide: mapperProvider,
          useFactory: mapperMockFactory,
        },
        LoggerService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    // it('should throw an unauthorized exception if login fails', () => {
    //   expect(
    //     controller.login({ phonenumber: 'invalid', password: 'invalid' }),
    //   ).rejects.toThrow(UnauthorizedException);
    // });
    // it('should return an access token if login succeeds', async () => {
    //   const mockResult = { accessToken: 'mocked-token' };
    //   const mockRequest = {
    //     method: 'POST',
    //     originalUrl: '/auth/login',
    //   };
    //   expect(
    //     controller.login(
    //       { phonenumber: 'johndoe', password: 'johndoe' },
    //       mockRequest as any,
    //     ),
    //   ).resolves.toEqual(mockResult);
    // });
  });
});
