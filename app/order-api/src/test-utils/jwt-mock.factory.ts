import { JwtService } from '@nestjs/jwt';
import { MockType } from './repository-mock.factory';

export const jwtServiceMockFactory: () => MockType<JwtService> = jest.fn(
  () => ({
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  }),
);
