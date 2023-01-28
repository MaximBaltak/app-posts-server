import {Column,JoinTable, CreateDateColumn, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import {CommentEntity} from "./Comment.entity";
import {UserEntity} from "./User.entity";
import {AppreciatedPostEntity} from "./AppreciatedPost.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'posts'})
export class PostEntity {
    @ApiProperty({required: true, nullable: false, description:'id поста'})
    @PrimaryGeneratedColumn()
    id: number
    @ApiProperty({required: true, nullable: false, description:'текст поста'})
    @Column({nullable: false, type: 'text'})
    text: string
    @ApiProperty({required: true, nullable: false, description:'колличество лайков'})
    @Column({nullable: false,default: 0})
    likes: number
    @ApiProperty({required: true, nullable: true, type: () => [CommentEntity], description:'комментарии данного поста'})
    @OneToMany(() => CommentEntity, CommentEntity => CommentEntity.post)
    comments: CommentEntity[]
    @ApiProperty({required: false, nullable: true, type: () => UserEntity, description:'создатель поста'})
    @ManyToOne(() => UserEntity, UserEntity => UserEntity, {
        onDelete: "SET NULL"
    })
    @JoinColumn({name: 'user_id'})
    user: UserEntity
    @ApiProperty({required: false, nullable: true, type: () => [UserEntity], description:'пользователи которые оценили этот пост'})
    @OneToMany(() => AppreciatedPostEntity, AppreciatedPostEntity => AppreciatedPostEntity)
    appreciatedByUsers: UserEntity[]
    @ApiProperty({required: true, nullable: false, description:'дата создания поста'})
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
