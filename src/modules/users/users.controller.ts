import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {PayloadToken, RequestAuth, UserAuth} from "../../types/auth";
import {Request, Response} from "express";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCookieAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {UserEntity} from "../../../database/entities/User.entity";
import {UserId} from "../../decorators/user/userId.decorator";

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) {
    }

    @ApiOperation({description: 'регистрирует пользователя'})
    @ApiBody({
        required: true, schema: {
            example: {
                login: 'Alex',
                password: '792'
            }
        }
    })
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiOkResponse({type: UserEntity})
    @Post('create')
    public async create(@Res() res: Response, @Body() data: RequestAuth) {
        if (!data?.login || !data?.password)
            res.json(new HttpException('bad request', HttpStatus.BAD_REQUEST))
        try {
            const result: UserAuth = await this.UsersService.create(data)
            res.cookie('auth', result.token, {maxAge: 1000 * 60 * 60 * 24})
            res.json(result.user)
        } catch (e) {
            res.status(400).json(new HttpException(e, HttpStatus.BAD_REQUEST))
        }
    }

    @ApiOperation({description: ' аунтентификация пользователя'})
    @ApiBody({
        required: true, schema: {
            example: {
                login: 'Alex',
                password: '792'
            }
        }
    })
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiOkResponse({type: UserEntity})
    @Post('login')
    public async login(@Res() res: Response, @Body() data: RequestAuth) {
        if (!data?.login || !data?.password)
            res.status(400).json(new HttpException('bad request', HttpStatus.BAD_REQUEST))
        try {
            const result: UserAuth = await this.UsersService.login(data)
            res.cookie('auth', result.token, {maxAge: 1000 * 60 * 60 * 24})
            res.json(result.user)
        } catch (e) {
            res.status(400).json(new HttpException(e, HttpStatus.BAD_REQUEST))
        }
    }

    @ApiCookieAuth('auth')
    @ApiInternalServerErrorResponse({schema: {example: new HttpException('error server', HttpStatus.INTERNAL_SERVER_ERROR)}})
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @ApiOkResponse({
        schema: {
            example: {
                message: 'the user deleted'
            }
        }
    })
    @ApiOperation({description: 'удаление пользователя'})
    @UseGuards(JwtAuthGuard)
    @Delete()
    public async remove(@Req() req: Request, @Res() res: Response,) {
        try {
            const payloadToken: PayloadToken = req.user as PayloadToken
            await this.UsersService.remove(payloadToken.id)
            res.clearCookie('auth')
            res.json({message: 'the user deleted'})
        } catch (e) {
            res.status(500).json(new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR))
        }
    }

    @ApiOperation({description: 'выход пользователя'})
    @ApiCookieAuth('auth')
    @ApiOkResponse({
        schema: {
            example: {
                message: 'the user exit'
            }
        }
    })
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @UseGuards(JwtAuthGuard)
    @Get('exit')
    public async exit(@Res() res: Response) {
        res.clearCookie('auth')
        res.json({message: 'the user exit'})
    }
    @ApiOkResponse({
        type: UserEntity
    })
    @ApiBadRequestResponse({schema: {example: new HttpException('bad request', HttpStatus.BAD_REQUEST)}})
    @ApiUnauthorizedResponse({schema: {example: new HttpException('unauthorized', HttpStatus.UNAUTHORIZED)}})
    @UseGuards(JwtAuthGuard)
    @Get('get')
    public async getUser(@UserId() userId: number): Promise<UserEntity | HttpException> {
        try {
            return await this.UsersService.getUser(userId)
        } catch (e) {
            return new HttpException(e, HttpStatus.BAD_REQUEST)
        }
    }
}
