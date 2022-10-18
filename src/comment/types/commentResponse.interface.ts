import { CommentEntity } from "@app/comment/comment.entity";
import { CommentType } from "@app/comment/types/comment.type";


export interface CommentResponseInterface {
    comment: CommentType
}
