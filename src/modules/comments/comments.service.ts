import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {Repository} from "typeorm";
import {PostEntity} from "../../../database/entities/Post.entity";
import {AppreciatedPostEntity} from "../../../database/entities/AppreciatedPost.entity";
import {AppreciatedCommentEntity} from "../../../database/entities/AppreciatedСomment.entity";
import {CommentEntity} from "../../../database/entities/Comment.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>,
        @InjectRepository(PostEntity)
        private PostRepository: Repository<PostEntity>,
        @InjectRepository(AppreciatedCommentEntity)
        private AppreciatedCommentRepository: Repository<AppreciatedCommentEntity>,
        @InjectRepository(CommentEntity)
        private CommentRepository: Repository<CommentEntity>,
    ) {
    }

    public async create(userId: number, postId: number, text: string): Promise<void> {
        const user: UserEntity = await this.UserRepository.findOneBy({id: userId})
        if (!user) throw new Error('the user not exist')
        const post: PostEntity = await this.PostRepository.findOneBy({id: postId})
        if (!post) throw new Error('the post not exist')
        const comment: CommentEntity = new CommentEntity()
        comment.user = user
        comment.post = post
        comment.text = text
        await this.CommentRepository.save(comment)
    }

    public async update(userId: number, commentId: number): Promise<void> {
        const user: UserEntity = await this.UserRepository.findOneBy({id: userId})
        if (!user) throw new Error('the user not exist')
        const comment: CommentEntity = await this.CommentRepository.findOneBy({id: commentId})
        if (!comment) throw new Error('the comment not exist')
        const AppreciatedComment: AppreciatedCommentEntity = await this.AppreciatedCommentRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id: userId})
            .where("appreciated.comment_id=:id", {id: commentId})
            .getOne()
        if (AppreciatedComment) {
            await this.AppreciatedCommentRepository.delete({id: AppreciatedComment.id})
            const likes: number = comment.likes ? comment.likes - 1 : 0
            await this.CommentRepository.update({id: commentId}, {likes})
        } else {
            const newAppreciatedComment: AppreciatedCommentEntity = new AppreciatedCommentEntity()
            newAppreciatedComment.user = user
            newAppreciatedComment.comment = comment
            await this.AppreciatedCommentRepository.save(newAppreciatedComment)
            const likes: number = comment.likes + 1
            await this.CommentRepository.update({id: commentId}, {likes})
        }
    }

    public async getPostsId(postId: number): Promise<CommentEntity[]> {
        return await this.CommentRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.post', 'post')
            .where("comment.post_id = :id", {id: postId})
            .getMany()
    }
}
