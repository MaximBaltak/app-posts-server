import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CommentEntity} from "./Comment.entity";
import {PostEntity} from "./Post.entity";
import {AppreciatedCommentEntity} from "./AppreciatedСomment.entity";
import {AppreciatedPostEntity} from "./AppreciatedPost.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'users'})
export class UserEntity {
    @ApiProperty({required: true, nullable: false, description:'id пользавателя'})
    @PrimaryGeneratedColumn()
    id: number
    @ApiProperty({required: true, nullable: false, description:'логин пользавателя'})
    @Column({nullable: false,unique: true})
    login: string
    @ApiProperty({required: true, nullable: false, description:'пароль пользавателя'})
    @Column({nullable: false})
    password: string
    @ApiProperty({required: false, nullable: true, type: () => [PostEntity], description:'созданные посты данным пользователем'})
    @OneToMany(() => PostEntity, PostEntity => PostEntity)
    createdPosts: PostEntity[]
    @ApiProperty({required: false, nullable: true, type: () => [CommentEntity], description:'созданные комментарии данным пользователем'})
    @OneToMany(() => CommentEntity, CommentEntity => CommentEntity)
    createdComments: CommentEntity[]
    @ApiProperty({required: true, nullable: true, type: () => [AppreciatedCommentEntity], description:'оценённые комментарии данным пользователем'})
    @OneToMany(() => AppreciatedCommentEntity, AppreciatedCommentEntity => AppreciatedCommentEntity.user)
    appreciatedComments: AppreciatedCommentEntity[]
    @ApiProperty({required: true, nullable: true, type: () => [AppreciatedPostEntity], description:'созданные посты данным пользователем'})
    @OneToMany(() => AppreciatedPostEntity, AppreciatedPostEntity => AppreciatedPostEntity.user)
    appreciatedPosts: AppreciatedPostEntity[]
    @ApiProperty({required: true, nullable: false, description:'дата регистрации пользователя'})
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
