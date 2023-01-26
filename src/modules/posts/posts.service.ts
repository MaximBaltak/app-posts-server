import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../../database/entities/User.entity";
import {Repository} from "typeorm";
import {PostEntity} from "../../../database/entities/Post.entity";
import {AppreciatedPostEntity} from "../../../database/entities/AppreciatedPost.entity";
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
        const AppreciatedPost: AppreciatedPostEntity = await this.AppreciatedPostRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id", {id: userId})
            .where("appreciated.post_id=:id", {id: postId})
            .getOne()
        console.log(AppreciatedPost)
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

    public async getPosts(): Promise<PostEntity[]> {
        return await this.PostRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.comments', 'comments')
            .getMany()
    }
    public async getAppreciatedPosts(userId: number): Promise<AppreciatedPostEntity[]>{
        return await this.AppreciatedPostRepository.createQueryBuilder('appreciated')
            .where("appreciated.user_id=:id",{id: userId})
            .leftJoinAndSelect("appreciated.post","post")
            .getMany()
    }
}
