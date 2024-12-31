import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductAnalysis1735360087563 implements MigrationInterface {
  name = 'AddProductAnalysis1735360087563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_analysis_tbl\` (\`id_column\` varchar(36) NOT NULL, \`slug_column\` varchar(255) NOT NULL, \`created_at_column\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at_column\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at_column\` datetime(6) NULL, \`created_by_column\` varchar(255) NULL, \`order_date_column\` datetime NOT NULL, \`total_quantity_column\` int NOT NULL, \`branch_column\` varchar(36) NULL, \`product_column\` varchar(36) NULL, UNIQUE INDEX \`IDX_12f6b9b89265c93cc0ad2c7305\` (\`slug_column\`), PRIMARY KEY (\`id_column\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_analysis_tbl\` ADD CONSTRAINT \`FK_8f0dce245461acc4cadd459f8f6\` FOREIGN KEY (\`branch_column\`) REFERENCES \`branch_tbl\`(\`id_column\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_analysis_tbl\` ADD CONSTRAINT \`FK_8fc74590caa6db96c83e16974c2\` FOREIGN KEY (\`product_column\`) REFERENCES \`product_tbl\`(\`id_column\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_analysis_tbl\` DROP FOREIGN KEY \`FK_8fc74590caa6db96c83e16974c2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_analysis_tbl\` DROP FOREIGN KEY \`FK_8f0dce245461acc4cadd459f8f6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_12f6b9b89265c93cc0ad2c7305\` ON \`product_analysis_tbl\``,
    );
    await queryRunner.query(`DROP TABLE \`product_analysis_tbl\``);
  }
}
