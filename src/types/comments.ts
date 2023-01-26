import {RequestCreatePost} from "./posts";

export interface RequestCreateComment extends RequestCreatePost{
    postId: number
}
