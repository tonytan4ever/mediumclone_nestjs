import { ArticleService } from "@app/article/article.service";
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";
import { AuthGuard } from "@app/user/guards/auth.guards";
import { Body, Controller, Get, Delete, Param, Post, UseGuards, UsePipes, Query } from "@nestjs/common";
import { CommentService } from "@app/comment/comment.service";
import { CreateCommentDto } from "@app/comment/dto/createComment.dto";
import { User } from "@app/user/decorators/user.decorator";
import { UserEntity } from "@app/user/user.entity";
import { CommentResponseInterface } from "@app/comment/types/commentResponse.interface";
import { DeleteResult } from "typeorm";
import { CommentsResponseInterface } from "./types/commentsResponse.interface";



@Controller('/articles/:slug/comments')
export class CommentController {

    constructor(
        private readonly articleService: ArticleService,
        private readonly commentService: CommentService
    ) {

    }

    @Get()
    async getArticleComments(@Param('slug') slug: string, @Query() query: any): Promise<CommentsResponseInterface> {
        const article = await this.articleService.findBySlug(slug);
        return await this.commentService.getArticleComments(article, query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe())
    async createArticleComment(@User() currentUser: UserEntity, @Param('slug') slug: string, @Body('comment') createCommentDto: CreateCommentDto): Promise<CommentResponseInterface> {
        const article = await this.articleService.findBySlug(slug);
        const comment = await this.commentService.creatArticleUserComment(currentUser, article, createCommentDto);
        return this.commentService.buildCommentResponse(comment);
    }


    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteArticleComment(@User('id') currentUserId: number, @Param('slug') slug: string, @Param('id') commentId: number, ): Promise<DeleteResult> {
        return await this.commentService.deleteComment(commentId, currentUserId);
    }
}
