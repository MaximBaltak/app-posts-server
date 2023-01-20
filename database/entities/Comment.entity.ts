import {Column, CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {PostEntity} from "./Post.entity";
import {UserEntity} from "./User.entity";
import {AppreciatedCommentEntity} from "./AppreciatedСomment.entity";

@Entity({name: 'comments'})
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column({nullable: false, type: 'text'})
    text: string
    @Column({nullable: false,default:0})
    likes: number
    @ManyToOne(() => PostEntity, PostEntity => PostEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'post_id'})
    post: PostEntity
    @ManyToOne(() => UserEntity, UserEntity => UserEntity, {
        onDelete: "SET NULL"
    })
    @JoinColumn({name: 'user_id'})
    user: UserEntity
    @OneToMany(() => AppreciatedCommentEntity, AppreciatedCommentEntity => AppreciatedCommentEntity.user)
    appreciatedByUsers: UserEntity[]
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
