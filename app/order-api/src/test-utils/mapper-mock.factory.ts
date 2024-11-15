import { Mapper } from '@automapper/core';

// Define a MockType for Mapper
export type MockMapperType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const mapperMockFactory: () => MockMapperType<Mapper> = jest.fn(() => ({
  map: jest.fn((source, _sourceType, _destinationType) => source), // Mock for `map` method
  mapArray: jest.fn((sources, _sourceType, _destinationType) => sources), // Mock for `mapArray` method
}));
