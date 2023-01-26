import {Column,JoinTable, CreateDateColumn, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import {CommentEntity} from "./Comment.entity";
import {UserEntity} from "./User.entity";
import {AppreciatedPostEntity} from "./AppreciatedPost.entity";

@Entity({name: 'posts'})
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number
    @Column({nullable: false, type: 'text'})
    text: string
    @Column({nullable: false,default: 0})
    likes: number
    @OneToMany(() => CommentEntity, CommentEntity => CommentEntity.post)
    comments: CommentEntity[]
    @ManyToOne(() => UserEntity, UserEntity => UserEntity, {
        onDelete: "SET NULL"
    })
    @JoinColumn({name: 'user_id'})
    user: UserEntity
    @OneToMany(() => AppreciatedPostEntity, AppreciatedPostEntity => AppreciatedPostEntity)
    appreciatedByUsers: UserEntity[]
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
