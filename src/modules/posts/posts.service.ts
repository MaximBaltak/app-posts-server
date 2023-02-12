import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {Repository} from "typeorm";
import {PostEntity} from "../../../database/entities/Post.entity";
import {AppreciatedPostEntity} from "../../../database/entities/AppreciatedPost.entity";
import {CommentsService} from "../comments/comments.service";
import {AppreciatedCommentEntity} from "../../../database/entities/AppreciatedСomment.entity";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(UserEntity)
        private UserRepository: Repository<UserEntity>,
        @InjectRepository(PostEntity)
        private PostRepository: Repository<PostEntity>,
        @InjectRepository(AppreciatedPostEntity)
        private AppreciatedPostRepository: Repository<AppreciatedPostEntity>,
        private CommentService: CommentsService
    ) {
    }

    public async create(userId: number, text: string): Promise<void> {
        const user: UserEntity = await this.UserRepository.findOneBy({id: userId})
        if (!user) throw new Error('the user not exist')
        const post: PostEntity = new PostEntity()
        post.text = text
        post.user = user
        await this.PostRepository.save(post)
    }

    public async update(userId: number, postId: number): Promise<void> {
        const user: UserEntity = await this.UserRepository.findOneBy({id: userId})
        if (!user) throw new Error('the user not exist')
        const post: PostEntity = await this.PostRepository.findOneBy({id: postId})
        if (!post) throw new Error('the post not exist')
        const AppreciatedPost: AppreciatedPostEntity = await this.AppreciatedPostRepository.findOne({
            where: {
                user: {id: userId},
                post: {id: postId},
            },
        })
        if (AppreciatedPost) {
            await this.AppreciatedPostRepository.delete({id: AppreciatedPost.id})
            const likes: number = post.likes ? post.likes - 1 : 0
            await this.PostRepository.update({id: postId}, {likes})
        } else {
            const newAppreciatedPost: AppreciatedPostEntity = new AppreciatedPostEntity()
            newAppreciatedPost.user = user
            newAppreciatedPost.post = post
            await this.AppreciatedPostRepository.save(newAppreciatedPost)
            const likes: number = post.likes + 1
            await this.PostRepository.update({id: postId}, {likes})
        }
    }

    public async getPosts(userId?: number): Promise<PostEntity[]> {
        const posts = await this.PostRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .orderBy('post.create_at', 'DESC')
            .getMany()
        for (let i = 0; i < posts.length; i++) {
            const comments = await this.CommentService.getPostsId(posts[i].id)
            posts[i].comments = [...comments]
        }
        if(userId) {
            const appreciatedPosts: AppreciatedPostEntity[] = await this.getAppreciatedPosts(userId)
            const appreciatedComment: AppreciatedCommentEntity[] = await this.CommentService.getAppreciatedComments(userId)
            posts.forEach(post => {
                appreciatedPosts.forEach(postA => {
                    if(postA.post.id === post.id) post.isLike = true
                })
                post.comments.forEach(comment => {
                    appreciatedComment.forEach(commentA => {
                        if(comment.id === commentA.comment.id) comment.isLike = true
                    })
                })
            })
        }
        return posts
    }

    public async getAppreciatedPosts(userId: number): Promise<AppreciatedPostEntity[]> {
        return await this.AppreciatedPostRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id: userId})
            .leftJoinAndSelect("appreciated.post", "post")
            .getMany()
    }
}
