import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyTrackingEntity1732847368723 implements MigrationInterface {
    name = 'ModifyTrackingEntity1732847368723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_c18ab30e5fe911bae91a6c02e4\` ON \`order_tbl\``);
        await queryRunner.query(`ALTER TABLE \`tracking_tbl\` CHANGE \`work_flow_instance_column\` \`workflow_execution_column\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_tbl\` DROP COLUMN \`workflow_execution_column\``);
        await queryRunner.query(`ALTER TABLE \`tracking_tbl\` ADD \`workflow_execution_column\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_tbl\` CHANGE \`status_column\` \`status_column\` varchar(255) NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tracking_tbl\` CHANGE \`status_column\` \`status_column\` varchar(255) NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`tracking_tbl\` DROP COLUMN \`workflow_execution_column\``);
        await queryRunner.query(`ALTER TABLE \`tracking_tbl\` ADD \`workflow_execution_column\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`tracking_tbl\` CHANGE \`workflow_execution_column\` \`work_flow_instance_column\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c18ab30e5fe911bae91a6c02e4\` ON \`order_tbl\` (\`payment_column\`)`);
    }

}
