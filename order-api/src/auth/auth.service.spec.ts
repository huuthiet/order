import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

describe('AuthService', () => {
  let service: AuthService;

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
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              userId: 1,
              username: 'johndoe',
              password: 'johndoe',
            }),
          },
        },
        LoggerService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw an unauthorized exception if login fails', () => {
      expect(
        service.login({ phonenumber: 'invalid', password: 'invalid' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return an access token if login succeeds', async () => {
      const mockResult = { accessToken: 'mocked-token' };
      expect(
        service.login({ phonenumber: 'johndoe', password: 'johndoe' }),
      ).resolves.toEqual(mockResult);
    });
  });
});
