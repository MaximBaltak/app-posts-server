import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards} from '@nestjs/common';
import {CommentsService} from "./comments.service";
import {ResponseString} from "../../types/posts";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserId} from "../../decorators/user/userId.decorator";
import {CommentEntity} from "../../../database/entities/Comment.entity";
import {RequestCreateComment} from "../../types/comments";

@Controller('comments')
export class CommentsController {
    constructor(private CommentsService: CommentsService) {
    }

    @Get(':postId')
    async getPostsId(@Param('postId') postId: number): Promise<CommentEntity[] | HttpException> {
        try {
            return await this.CommentsService.getPostsId(postId)
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() data: RequestCreateComment, @UserId() userId: number): Promise<ResponseString | HttpException> {
        if (!data?.text) return new HttpException('bad request', HttpStatus.BAD_REQUEST)
        if (!data?.postId) return new HttpException('bad request', HttpStatus.BAD_REQUEST)
        try {
            await this.CommentsService.create(userId, data.postId, data.text)
            return {message: 'the comment added'}
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':commentId')
    async update(@Param('commentId') commentId: number, @UserId() userId: number): Promise<ResponseString | HttpException> {
        try {
            await this.CommentsService.update(userId, commentId)
            return {message: 'the comment updated'}
        } catch (e) {
            return new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}
