import {Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {PayloadToken, RequestAuth, UserAuth} from "../../types/auth";
import {Request, Response} from "express";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) {}
    @Post('create')
    public async create(@Res() res: Response, @Body() data: RequestAuth) {
        if (!data?.login || !data?.password)
            res.json(new HttpException('bad request',HttpStatus.BAD_REQUEST))
        try {
            const result: UserAuth = await this.UsersService.create(data)
            res.cookie('auth',result.token,{maxAge: 1000 * 60 * 60 *24})
            res.json(result.user)
        }catch (e){
            res.json(new HttpException(e,HttpStatus.BAD_REQUEST))
        }
    }
    @Post('login')
    public async login(@Res() res: Response, @Body() data: RequestAuth) {
        if (!data?.login || !data?.password)
            res.json(new HttpException('bad request',HttpStatus.BAD_REQUEST))
        try {
            const result: UserAuth = await this.UsersService.login(data)
            res.cookie('auth',result.token,{maxAge: 1000 * 60 * 60 *24})
            res.json(result.user)
        }catch (e){
            res.json(new HttpException(e,HttpStatus.BAD_REQUEST))
        }
    }
    @UseGuards(JwtAuthGuard)
    @Delete()
    public async remove(@Req() req: Request,@Res() res: Response,) {
        try {
            const payloadToken: PayloadToken = req.user as PayloadToken
            await this.UsersService.remove(payloadToken.id)
            res.clearCookie('auth')
            res.json({message:'the user deleted'})
        }catch (e){
            res.json(new HttpException(e,HttpStatus.INTERNAL_SERVER_ERROR))
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('exit')
    public async exit(@Res() res: Response){
        res.clearCookie('auth')
        res.json({message:'the user exit'})
    }
}
