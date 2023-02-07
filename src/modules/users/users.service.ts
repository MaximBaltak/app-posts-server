import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {Repository} from "typeorm";
import {AuthService} from "../auth/services/auth.service";
import {PayloadToken, RequestAuth, UserAuth} from "../../types/auth";
import * as bcrypt from 'bcryptjs'
import {AppreciatedCommentEntity} from "../../../database/entities/AppreciatedСomment.entity";
import {AppreciatedPostEntity} from "../../../database/entities/AppreciatedPost.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>,
        @InjectRepository(AppreciatedPostEntity)
        private AppreciatedPostRepository: Repository<AppreciatedPostEntity>,
        @InjectRepository(AppreciatedCommentEntity)
        private AppreciatedCommentRepository: Repository<AppreciatedCommentEntity>,
        private AuthService: AuthService
    ) {
    }

    public async create(data: RequestAuth): Promise<UserAuth> {
        const findUser: UserEntity = await this.UserRepository.findOneBy({login: data.login})
        if (findUser) throw new Error('the user exist')
        const hashPassword: string = await bcrypt.hash(data.password, 10)
        const newUser: UserEntity = new UserEntity()
        newUser.login = data.login
        newUser.password = hashPassword
        await this.UserRepository.save(newUser)
        const user: UserEntity = await this.UserRepository.createQueryBuilder("user")
            .where("user.login = :login", {login: data.login})
            .getOne()
        const appreciatedPosts: AppreciatedPostEntity[] = await this.AppreciatedPostRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id: user.id})
            .leftJoinAndSelect("appreciated.post", "post")
            .getMany()
        const appreciatedComments: AppreciatedCommentEntity[] = await this.AppreciatedCommentRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id: user.id})
            .leftJoinAndSelect("appreciated.comment", "comment")
            .getMany()
        user.appreciatedPosts = appreciatedPosts
        user.appreciatedComments = appreciatedComments
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

    public async login(data: RequestAuth): Promise<UserAuth> {
        const findUser: UserEntity = await this.UserRepository.createQueryBuilder("user")
            .where("user.login = :login", {login: data.login})
            .getOne()
        if (!findUser) throw new Error('the user not exist')
        const isPassword: boolean = await bcrypt.compare(data.password, findUser.password)
        if (!isPassword) throw new Error('the user not exist')
        const appreciatedPosts: AppreciatedPostEntity[] = await this.AppreciatedPostRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id: findUser.id})
            .leftJoinAndSelect("appreciated.post", "post")
            .getMany()
        const appreciatedComments: AppreciatedCommentEntity[] = await this.AppreciatedCommentRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id: findUser.id})
            .leftJoinAndSelect("appreciated.comment", "comment")
            .getMany()
        findUser.appreciatedPosts = appreciatedPosts
        findUser.appreciatedComments = appreciatedComments
        const payload: PayloadToken = {
            id: findUser.id,
            login: findUser.login
        }
        const token: string = this.AuthService.auth(payload)
        return {
            user: findUser,
            token
        }
    }

    public async getUser(id: number): Promise<UserEntity> {
        const findUser: UserEntity = await this.UserRepository.createQueryBuilder("user")
            .where("user.id = :id", {id})
            .getOne()
        if (!findUser) throw new Error('the user not exist')
        const appreciatedPosts: AppreciatedPostEntity[] = await this.AppreciatedPostRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id})
            .leftJoinAndSelect("appreciated.post", "post")
            .getMany()
        const appreciatedComments: AppreciatedCommentEntity[] = await this.AppreciatedCommentRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id})
            .leftJoinAndSelect("appreciated.comment", "comment")
            .getMany()
        findUser.appreciatedPosts = appreciatedPosts
        findUser.appreciatedComments = appreciatedComments
        return findUser
    }

    public async remove(id: number) {
        await this.UserRepository.delete({id})
    }

}
