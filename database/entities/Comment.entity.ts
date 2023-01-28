import {Column, CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {PostEntity} from "./Post.entity";
import {UserEntity} from "./User.entity";
import {AppreciatedCommentEntity} from "./AppreciatedСomment.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'comments'})
export class CommentEntity {
    @ApiProperty({required: true, nullable: false, description:'id комментария'})
    @PrimaryGeneratedColumn()
    id: number
    @ApiProperty({required: true, nullable: false, description:'текст комментария'})
    @Column({nullable: false, type: 'text'})
    text: string
    @ApiProperty({required: true, nullable: false, description:'колличество лайков'})
    @Column({nullable: false,default:0})
    likes: number
    @ApiProperty({required: true, nullable: false, type: () => PostEntity, description:'пост под которым оставлен комментарий'})
    @ManyToOne(() => PostEntity, PostEntity => PostEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'post_id'})
    post: PostEntity
    @ApiProperty({required: true, nullable: true, type: () => UserEntity, description:'создатель комментария'})
    @ManyToOne(() => UserEntity, UserEntity => UserEntity, {
        onDelete: "SET NULL"
    })
    @JoinColumn({name: 'user_id'})
    user: UserEntity
    @ApiProperty({required: false, nullable: true, type: () => [UserEntity], description:'пользователи которые оценили комментарий'})
    @OneToMany(() => AppreciatedCommentEntity, AppreciatedCommentEntity => AppreciatedCommentEntity.user)
    appreciatedByUsers: UserEntity[]
    @ApiProperty({required: true, nullable: false, description:'дата создания комментария'})
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
