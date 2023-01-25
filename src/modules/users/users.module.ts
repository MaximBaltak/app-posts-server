import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {AppreciatedPostEntity} from "../../../database/entities/AppreciatedPost.entity";
import {AppreciatedCommentEntity} from "../../../database/entities/AppreciatedСomment.entity";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, AppreciatedPostEntity, AppreciatedCommentEntity])],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {
}
