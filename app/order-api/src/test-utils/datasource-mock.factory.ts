import { DataSource } from 'typeorm';
import { MockType } from './repository-mock.factory';

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(
  () => ({}),
);
