import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentArticleRelationship1666047310777 implements MigrationInterface {
    name = 'AddCommentArticleRelationship1666047310777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "articleId" integer`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "articleId"`);
    }

}
