import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifySystemConfig1733909416484 implements MigrationInterface {
    name = 'ModifySystemConfig1733909416484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_09e065bddaff3b63e5752a3b7e\` ON \`system_config_tbl\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_09e065bddaff3b63e5752a3b7e\` ON \`system_config_tbl\` (\`value_column\`)`);
    }

}
