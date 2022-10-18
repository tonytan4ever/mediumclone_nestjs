import { CommentType } from "@app/comment/types/comment.type";


export interface CommentsResponseInterface {
    comments: CommentType[];
    commentsCount: number;
}
