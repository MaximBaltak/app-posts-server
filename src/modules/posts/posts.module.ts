import {Module} from '@nestjs/common';
import {PostsController} from './posts.controller';
import {PostsService} from './posts.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {PostEntity} from "../../../database/entities/Post.entity";
import {AppreciatedPostEntity} from "../../../database/entities/AppreciatedPost.entity";
import {CommentsService} from "../comments/comments.service";
import {AppreciatedCommentEntity} from "../../../database/entities/AppreciatedСomment.entity";
import {CommentEntity} from "../../../database/entities/Comment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, PostEntity, AppreciatedPostEntity, AppreciatedCommentEntity, CommentEntity])],
    controllers: [PostsController],
    providers: [PostsService, CommentsService]
})
export class PostsModule {
}
