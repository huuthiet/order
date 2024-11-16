import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/logger/logger.service';
import {
  MockType,
  repositoryMockFactory,
} from 'src/test-utils/repository-mock.factory';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';
import {
  LoginAuthRequestDto,
  RegisterAuthRequestDto,
  RegisterAuthResponseDto,
} from './auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { jwtServiceMockFactory } from 'src/test-utils/jwt-mock.factory';
import { Mapper } from '@automapper/core';

describe('AuthService', () => {
  const mapperProvider = 'automapper:nestjs:default';
  let service: AuthService;
  let userRepositoryMock: MockType<Repository<User>>;
  let config: ConfigService;
  let jwtService: MockType<JwtService>;
  let mapperMock: MockType<Mapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useFactory: jwtServiceMockFactory,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
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

    service = module.get<AuthService>(AuthService);
    userRepositoryMock = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    mapperMock = module.get(mapperProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Validate user', () => {
    it('should return null if the user not found', async () => {
      // Mock input
      const mockInput = {
        phonenumber: 'phonenumber',
        password: 'password',
      };

      // Mock implementation
      userRepositoryMock.findOne.mockReturnValue(null);

      // Assertions
      expect(
        await service.validateUser(mockInput.phonenumber, mockInput.password),
      ).toBeNull();
    });

    it('should return null if the password does not match', async () => {
      // Mock input
      const mockInput = {
        phonenumber: 'phonenumber',
        password: 'password',
      };

      // Mock output
      const mockUser = {
        id: 1,
        phonenumber: 'phonenumber',
        password: 'password',
      };

      // Mock implementation
      userRepositoryMock.findOne.mockReturnValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation((hash, pass) => false);

      // Assertions
      expect(
        await service.validateUser(mockInput.phonenumber, mockInput.password),
      ).toBeNull();
    });

    it('should return a user if the user is found', async () => {
      // Mock input
      const mockInput = {
        phonenumber: 'phonenumber',
        password: 'password',
      };

      // Mock output
      const mockUser = {
        id: 1,
        phonenumber: 'phonenumber',
        password: 'password',
      };

      // Mock implementation
      userRepositoryMock.findOne.mockReturnValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation((hash, pass) => true);

      // Assertions
      expect(
        await service.validateUser(mockInput.phonenumber, mockInput.password),
      ).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should throw an unauthorized exception if login fails', async () => {
      // mock input
      const mockReq = {
        phonenumber: 'phonenumber',
        password: 'password',
      } as LoginAuthRequestDto;

      // Mock implementation
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      // Assertions
      expect(service.login(mockReq)).rejects.toThrow(UnauthorizedException);
    });

    it('should return an access token if login succeeds', async () => {
      // Mock input
      const mockReq = {
        phonenumber: 'phonenumber',
        password: 'password',
      } as LoginAuthRequestDto;

      const mockUser = {
        id: 'uuid',
        phonenumber: 'phonenumber',
        password: 'password',
      } as User;

      // Mock output
      const mockResult = { accessToken: 'mocked-token' };

      // Mock implementation
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(mockResult.accessToken);

      // Assertions
      expect(await service.login(mockReq)).toEqual(mockResult);
    });
  });

  describe('Register', () => {
    it('should be thrown unauthorization exception if the user is found', async () => {
      // mock input
      const mockInput = {
        firstName: '',
        lastName: '',
        password: '',
        phonenumber: '',
      } as RegisterAuthRequestDto;

      const mockUserEntity = {
        firstName: '',
        lastName: '',
        slug: '',
        phonenumber: '',
        password: '',
      } as User;

      // Mock implementation
      userRepositoryMock.findOne.mockReturnValue(mockUserEntity);

      // Assertions
      expect(service.register(mockInput)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should return user if register succeeds', async () => {
      // mock input
      const mockInput = {
        firstName: '',
        lastName: '',
        password: '',
        phonenumber: '',
      } as RegisterAuthRequestDto;

      const mockUserEntity = {
        firstName: '',
        lastName: '',
        slug: '',
        phonenumber: '',
        password: '',
      } as User;

      const mockUserOutput = {
        firstName: '',
        lastName: '',
        slug: '',
        phonenumber: '',
      };

      // Mock implementation
      userRepositoryMock.findOne.mockReturnValue(null);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((pass, saltOfRounds) => 'hashed-password');
      userRepositoryMock.create.mockReturnValue(mockUserEntity);
      userRepositoryMock.save.mockReturnValue(mockUserEntity);
      mapperMock.map.mockImplementation(
        (source, sourceType, destinationType) => {
          if (sourceType === RegisterAuthRequestDto && destinationType === User)
            return mockUserEntity; // Mocked User entity
          if (
            sourceType === User &&
            destinationType === RegisterAuthResponseDto
          )
            return mockUserOutput; // Mocked user response
          return null;
        },
      );

      // Assertions
      expect(await service.register(mockInput)).toEqual(mockUserOutput);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
