import {Body, Controller, HttpException, HttpStatus, Post, Res} from '@nestjs/common';
import {UsersService} from "./users.service";
import {RequestAuth, UserAuth} from "../../types/auth";
import {Response} from "express";

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
}
