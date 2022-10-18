import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentEntityAndTextField1666037927926 implements MigrationInterface {
    name = 'AddCommentEntityAndTextField1666037927926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "body" text NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "body" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4548cc4a409b8651ec75f70e280" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4548cc4a409b8651ec75f70e280"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "body" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
