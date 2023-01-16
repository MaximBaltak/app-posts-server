import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {InsertResult, Repository} from "typeorm";
import {AuthService} from "../auth/services/auth.service";
import {PayloadToken, RequestAuth, UserAuth} from "../../types/auth";
import * as bcrypt from 'bcryptjs'
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>,
        private AuthService: AuthService
    ) {}
    public async create(data: RequestAuth): Promise<UserAuth> {
        const findUser: UserEntity = await this.UserRepository.findOneBy({login: data.login})
        if (findUser) throw new Error('the user exist')
        const hashPassword: string = await bcrypt.hash(data.password, 10)
        const newUser: UserEntity = new UserEntity()
        newUser.login = data.login
        newUser.password = hashPassword
        await this.UserRepository.save(newUser)
        const user: UserEntity = await this.UserRepository.findOneBy({login:data.login})
        const payload: PayloadToken = {
            id: user.id,
            login: user.login
        }
        const token: string = this.AuthService.auth(payload)
        return {
            user,
            token
        }
    }

}
