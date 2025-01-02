import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionManagerService {
  constructor(private readonly dataSource: DataSource) {}

  async execute(
    onSave: (manager: QueryRunner['manager']) => Promise<any>,
    onSuccess?: () => void,
    onFailure?: (error: any) => void,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await onSave(queryRunner.manager);
      await queryRunner.commitTransaction();
      onSuccess();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      onFailure(error);
    } finally {
      await queryRunner.release();
    }
  }
}
