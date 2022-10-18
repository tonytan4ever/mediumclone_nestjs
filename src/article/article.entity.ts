import { BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "@app/user/user.entity";
import { CommentEntity } from "@app/comment/comment.entity";


@Entity({ name: 'articles'})
export class ArticleEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

    @Column()
    title: string;

    @Column({default: ''})
    description: string;

    @Column('text', {default: ''})
    body: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @Column('simple-array')
    tagList: string[];

    @Column({default: 0})
    favoritesCount: number;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }

    @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
    author: UserEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.article)
    comments: CommentEntity;

}
