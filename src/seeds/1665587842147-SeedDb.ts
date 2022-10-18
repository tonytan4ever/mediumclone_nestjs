import { MigrationInterface, QueryRunner } from "typeorm";

export class SeeDb1665587842147 implements MigrationInterface {
    name = 'SeeDb1665587842147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`);

        //password is 123
        await queryRunner.query(`INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$jwxuwub5wXC23jHVK95wXe4.I1ZJEauj1.Mw/hrEojF6TSteGxfLm')`);

        await queryRunner.query(`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First Article', 'First Article description', 'First article body', 'coffee,dragons', 1), ('second-article', 'Second Article', 'Second Article description', 'Second article body', 'coffee,dragons', 1)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
