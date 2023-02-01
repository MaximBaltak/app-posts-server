import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards} from '@nestjs/common';
import {PostsService} from "./posts.service";
import {PostEntity} from "../../../database/entities/Post.entity";
import {RequestCreatePost, ResponseString} from "../../types/posts";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserId} from "../../decorators/user/userId.decorator";
import {AppreciatedPostEntity} from "../../../database/entities/AppreciatedPost.entity";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCookieAuth, ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private PostsService: PostsService) {
    }

    @ApiInternalServerErrorResponse({schema: {example: new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR)}})
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiOkResponse({type: [PostEntity]})
    @ApiOperation({description: 'получение всех постов'})
    @Get()
    async getPosts(): Promise<PostEntity[] | HttpException> {
        try {
            return await this.PostsService.getPosts()
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiCookieAuth('auth')
    @ApiInternalServerErrorResponse({schema: {example: new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR)}})
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiOkResponse({
        schema: {
            example: {
                message: 'the post added'
            }
        }
    })
    @ApiBody({
        schema: {
            example: {
                text: 'post 1'
            }
        }
    })
    @ApiOperation({description: 'Создание поста'})
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(@Body() data: RequestCreatePost, @UserId() userId: number): Promise<ResponseString | HttpException> {
        if (!data?.text) return new HttpException('bad request', HttpStatus.BAD_REQUEST)
        try {
            await this.PostsService.create(userId, data.text)
            return {message: 'the post added'}
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiCookieAuth('auth')
    @ApiOkResponse({
        schema: {
            example: {
                message: 'the post updated'
            }
        }
    })

    @ApiOperation({description: 'оценка поста'})
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

    @ApiCookieAuth('auth')
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiOkResponse({type: [AppreciatedPostEntity]})
    @ApiOperation({description: 'получение оцененных постов'})
    @UseGuards(JwtAuthGuard)
    @Get('appreciated')
    async getAppreciatedPosts(@UserId() userId: number): Promise<AppreciatedPostEntity[] | HttpException> {
        try {
            return await this.PostsService.getAppreciatedPosts(userId)
        } catch (e) {
            return new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}
