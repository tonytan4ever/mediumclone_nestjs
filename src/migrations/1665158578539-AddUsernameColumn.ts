import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameColumn1665158578539 implements MigrationInterface {
    name = 'AddUsernameColumn1665158578539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
