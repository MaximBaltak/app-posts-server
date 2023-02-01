import {CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./User.entity";
import {CommentEntity} from "./Comment.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: 'appreciated-comments'})
export class AppreciatedCommentEntity {
    @ApiProperty({required: true, nullable: false, description:'id записи оценки комментария'})
    @PrimaryGeneratedColumn()
    id: number
    @ApiProperty({required: true, nullable: false,  type: () => CommentEntity,description:'оценённый комментарий'})
    @ManyToOne(() => CommentEntity, CommentEntity => CommentEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'comment_id'})
    comment: CommentEntity
    @ManyToOne(() => UserEntity, UserEntity => UserEntity, {
        onDelete: "CASCADE"
    })
    @ApiProperty({required: false, nullable: false, type: () => UserEntity, description:'пользователь который оценил комментарий'})
    @JoinColumn({name: 'user_id'})
    user: UserEntity
    @ApiProperty({required: true, nullable: false, description:'дата оценки'})
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
