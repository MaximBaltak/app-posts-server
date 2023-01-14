import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import {Request} from "express";
import {AuthInterface} from "../../../types/auth";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.fromTokenAsCookies,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }
    static fromTokenAsCookies(req: Request){
        if(req?.cookies){
            return req.cookies['auth']
        } else {
            return null
        }
    }
    async validate(payload: AuthInterface) {
        return { login: payload.login, password: payload.password};
    }
}
