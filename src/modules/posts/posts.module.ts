import {Module} from '@nestjs/common';
import {PostsController} from './posts.controller';
import {PostsService} from './posts.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {PostEntity} from "../../../database/entities/Post.entity";
import {AppreciatedPostEntity} from "../../../database/entities/AppreciatedPost.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, PostEntity, AppreciatedPostEntity])],
    controllers: [PostsController],
    providers: [PostsService]
})
export class PostsModule {
}
