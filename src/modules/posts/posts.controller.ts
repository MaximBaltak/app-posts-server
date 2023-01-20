import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards} from '@nestjs/common';
import {PostsService} from "./posts.service";
import {PostEntity} from "../../../database/entities/Post.entity";
import {RequestCreatePost, ResponseString} from "../../types/posts";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserId} from "../../decorators/user/userId.decorator";

@Controller('posts')
export class PostsController {
    constructor(private PostsService: PostsService) {
    }

    @Get()
    async getPosts(): Promise<PostEntity[] | HttpException> {
        try {
            return await this.PostsService.getPosts()
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() data: RequestCreatePost, @UserId() userId: number): Promise<ResponseString | HttpException> {
        if (!data?.text) return new HttpException('bad request', HttpStatus.BAD_REQUEST)
        try {
            await this.PostsService.create(userId, data.text)
            return {message: ' the post added'}
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':postId')
    async update(@Param('postId') postId: number, @UserId() userId: number): Promise<ResponseString | HttpException> {
        try {
            await this.PostsService.update(userId, postId)
            return {message: 'the post updated'}
        } catch (e) {
            return new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}
