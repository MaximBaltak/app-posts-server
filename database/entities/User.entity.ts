import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CommentEntity} from "./Comment.entity";
import {PostEntity} from "./Post.entity";
import {AppreciatedCommentEntity} from "./AppreciatedСomment.entity";
import {AppreciatedPostEntity} from "./AppreciatedPost.entity";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column({nullable: false})
    login: string
    @Column({nullable: false})
    password: string
    @OneToMany(() => PostEntity, PostEntity => PostEntity)
    createdPosts: PostEntity[]
    @OneToMany(() => CommentEntity, CommentEntity => CommentEntity)
    createdComments: CommentEntity[]
    @OneToMany(() => AppreciatedCommentEntity, AppreciatedCommentEntity => AppreciatedCommentEntity.comment)
    appreciatedComments: CommentEntity[]
    @OneToMany(() => AppreciatedPostEntity, AppreciatedPostEntity => AppreciatedPostEntity.post)
    appreciatedPosts: PostEntity[]
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
