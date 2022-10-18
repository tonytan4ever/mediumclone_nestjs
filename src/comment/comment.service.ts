import { ArticleEntity } from "@app/article/article.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CommentEntity } from "@app/comment/comment.entity";
import { CreateCommentDto } from "@app/comment/dto/createComment.dto";
import { UserEntity } from "@app/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { CommentResponseInterface } from "@app/comment/types/commentResponse.interface";
import { CommentsResponseInterface } from "@app/comment/types/commentsResponse.interface";


@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity) private readonly commentRepository: Repository<CommentEntity>,
    ) {

    }

    async getArticleComments(article: ArticleEntity, query: any): Promise<CommentsResponseInterface> {
        const queryBuilder = this.commentRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('comments.author', 'author')
            .andWhere('comments.articleId = :id', {
                id: article.id}
            );

        const commentsCount = await queryBuilder.getCount();

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        const comments = await queryBuilder.getMany();

        return { comments: comments, commentsCount }
    }


    buildCommentResponse(comment: CommentEntity): CommentResponseInterface {
        return { comment };
    }


    async creatArticleUserComment(user: UserEntity, article: ArticleEntity, createCommentDto: CreateCommentDto): Promise<CommentEntity> {
        /*
        Create a comment for article, and the author is the param user
        */
        const comment: CommentEntity = new CommentEntity();
        Object.assign(comment, createCommentDto);

        comment.article = article;
        comment.author = user;

        return await this.commentRepository.save(comment);
    }

    async deleteComment(commentId: number, currentUserId: number): Promise<DeleteResult> {
        const comment = await this.commentRepository.findOneBy({
            id: commentId
        })

        if (!comment) {
            throw new HttpException('Comment does not exist', HttpStatus.NOT_FOUND);
        }

        if (comment.author.id !== currentUserId) {
            throw new HttpException('You are not the author of this comment', HttpStatus.FORBIDDEN);
        }

        return this.commentRepository.delete({id: commentId});
    }

    //async createComment

}
