import { CommentEntity } from "@app/comment/comment.entity";

export type CommentType = Omit<CommentEntity, 'article'>;
