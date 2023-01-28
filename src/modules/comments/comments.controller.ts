import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {CommentsService} from "./comments.service";
import {ResponseString} from "../../types/posts";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {UserId} from "../../decorators/user/userId.decorator";
import {CommentEntity} from "../../../database/entities/Comment.entity";
import {RequestCreateComment} from "../../types/comments";
import {AppreciatedCommentEntity} from "../../../database/entities/AppreciatedСomment.entity";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCookieAuth, ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(private CommentsService: CommentsService) {
    }

    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiOkResponse({type: [CommentEntity]})
    @ApiQuery({required: true, type: 'number', name: 'postId'})
    @ApiOperation({description: 'получение всех комментариев у данного поста'})
    @Get()
    async getPostsId(@Query('postId') postId: number): Promise<CommentEntity[] | HttpException> {
        try {
            return await this.CommentsService.getPostsId(postId)
        } catch (e) {
            return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @ApiCookieAuth('auth')
    @ApiOkResponse({
        schema: {
            example: {
                message: 'the comment added'
            }
        }
    })
    @ApiBody({
        schema: {
            example: {
                postId: 3,
                text: 'post 1'
            }
        }
    })
    @ApiInternalServerErrorResponse({schema: {example: new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR)}})
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiOperation({description: 'Создание комментария'})
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

    @ApiCookieAuth('auth')
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiOkResponse({
        schema: {
            example: {
                message: 'the comment updated'
            }
        }
    })

    @ApiOperation({description: 'оценка комментария'})
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

    @ApiCookieAuth('auth')
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiOkResponse({type: [AppreciatedCommentEntity]})
    @ApiOperation({description: 'получение оцененных комментариев'})
    @UseGuards(JwtAuthGuard)
    @Get('appreciated')
    async getAppreciatedComments(@UserId() userId: number): Promise<AppreciatedCommentEntity[] | HttpException> {
        try {
            return await this.CommentsService.getAppreciatedComments(userId)
        } catch (e) {
            return new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}
