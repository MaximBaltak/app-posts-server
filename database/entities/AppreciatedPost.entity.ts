import {CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import {PostEntity} from "./Post.entity";
import {UserEntity} from "./User.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'appreciated-posts'})
export class AppreciatedPostEntity {
    @ApiProperty({required: true, nullable: false, description:'id записи оценки поста'})
    @PrimaryGeneratedColumn()
    id: number
    @ApiProperty({required: true, nullable: false, type: () => PostEntity, description:'оценённый пост'})
    @ManyToOne(() => PostEntity, PostEntity => PostEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'post_id'})
    post: PostEntity
    @ApiProperty({required: false, nullable: false, type: () => UserEntity, description:'пользователь который оценил пост'})
    @ManyToOne(() => UserEntity, UserEntity => UserEntity, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: 'user_id'})
    user: UserEntity
    @ApiProperty({required: true, nullable: false, description:'дата оценки'})
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
