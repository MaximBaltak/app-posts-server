import {CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./User.entity";
import {CommentEntity} from "./Comment.entity";

@Entity({name: 'appreciated-comments'})
export class AppreciatedCommentEntity {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => CommentEntity, CommentEntity => CommentEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'comment_id'})
    comment: CommentEntity
    @ManyToOne(() => UserEntity, UserEntity => UserEntity, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: 'user_id'})
    user: UserEntity
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
