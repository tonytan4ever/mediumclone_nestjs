import { ArticleEntity } from "@app/article/article.entity";
import { UserEntity } from "@app/user/user.entity";
import { classToPlain, Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'comments'})
export class CommentEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    body: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.comments, { eager: true})
    author: UserEntity;

    @Exclude({ toPlainOnly: true })
    @ManyToOne(() => ArticleEntity, (article) => article.comments)
    @JoinColumn()
    article: ArticleEntity;

    // Needs to use toJSON to exclude the article field
    toJSON() {
        return classToPlain(this);
    }
}
