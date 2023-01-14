import { Module } from '@nestjs/common';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategy/jwt.strategy";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import { AuthService } from './services/auth.service';
import {AuthController} from "./auth.controller";

@Module({
    imports:[
        PassportModule.register({
            session:false
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions:{ expiresIn: '1d' }
        })
    ],
    controllers: [AuthController],
    providers:[JwtStrategy,JwtAuthGuard, AuthService],
    exports: [AuthService]
})
export class AuthModule {}
