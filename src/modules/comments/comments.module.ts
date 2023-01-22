import {Module} from '@nestjs/common';
import {CommentsController} from './comments.controller';
import {CommentsService} from './comments.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {PostEntity} from "../../../database/entities/Post.entity";
import {CommentEntity} from "../../../database/entities/Comment.entity";
import {AppreciatedCommentEntity} from "../../../database/entities/AppreciatedСomment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, PostEntity, AppreciatedCommentEntity,CommentEntity])],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class CommentsModule {
}
