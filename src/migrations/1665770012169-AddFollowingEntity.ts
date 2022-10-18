import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFollowingEntity1665770012169 implements MigrationInterface {
    name = 'AddFollowingEntity1665770012169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follows" ("id" SERIAL NOT NULL, "followerId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "follows"`);
    }

}
