import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import {
  MockType,
  repositoryMockFactory,
} from 'src/test-utils/repository-mock.factory';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginAuthRequestDto } from './auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepositoryMock: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-token'), // Mock the sign method
          },
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        LoggerService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepositoryMock = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    // it('should throw an unauthorized exception if login fails', async () => {
    //   // mock input
    //   const mockReq = {
    //     phonenumber: 'phonenumber',
    //     password: 'password',
    //   } as LoginAuthRequestDto;
    //   // Mock implementation
    //   userRepositoryMock.findOne.mockReturnValue(null);
    //   expect(service.login(mockReq)).rejects.toThrow(UnauthorizedException);
    // });
    // it('should return an access token if login succeeds', async () => {
    //   const mockResult = { accessToken: 'mocked-token' };
    //   expect(
    //     service.login({ phonenumber: 'johndoe', password: 'johndoe' }),
    //   ).resolves.toEqual(mockResult);
    // });
  });
});
