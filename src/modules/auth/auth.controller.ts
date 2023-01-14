import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {AuthInterface} from "../../types/auth";
import {AuthService} from "./services/auth.service";
import {Response} from "express";
import {Request} from "express";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService) {
    }
    @Post()
    login(@Body() payload: AuthInterface,@Res() res: Response): void{
        const token: string = this.AuthService.auth(payload)
        res.cookie('auth',token,{maxAge: 1000 * 60 * 16 * 24})
        res.send('Всё хорошо')
    }
    @UseGuards(JwtAuthGuard)
    @Get('test')
    test(@Req() req: Request): string{
        console.log(req.user)
        return "Окей"
    }
}
