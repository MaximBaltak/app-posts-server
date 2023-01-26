import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {PayloadToken} from "../../../types/auth";

@Injectable()
export class AuthService {
    constructor(private JwtService: JwtService) {}

    public auth(payload: PayloadToken): string {
        return this.JwtService.sign(payload, {secret: process.env.JWT_SECRET, expiresIn: '1d'})
    }

}
