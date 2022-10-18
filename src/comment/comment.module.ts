import { Module } from "@nestjs/common";
import { CommentController } from "@app/comment/comment.controller";
import { ArticleService } from "@app/article/article.service";
import { CommentService } from "./comment.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "@app/article/article.entity";
import { UserEntity } from "@app/user/user.entity";
import { CommentEntity } from "@app/comment/comment.entity";
import { FollowEntity } from "@app/profile/follow.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, CommentEntity, FollowEntity])],
    controllers: [CommentController],
    providers: [ArticleService, CommentService]
})
export class CommentModule {

}
