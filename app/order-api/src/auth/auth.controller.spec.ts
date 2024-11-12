import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
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
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-token'),
          },
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
    it('should throw an unauthorized exception if login fails', () => {
      const mockRequest = {
        method: 'POST',
        originalUrl: '/auth/login',
      };
      expect(
        controller.login(
          { phonenumber: 'invalid', password: 'invalid' },
          mockRequest as any,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

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
