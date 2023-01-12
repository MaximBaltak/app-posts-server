import {CreateDateColumn, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import {PostEntity} from "./Post.entity";
import {UserEntity} from "./User.entity";

@Entity({name: 'appreciated-posts'})
export class AppreciatedPostEntity {
    @PrimaryGeneratedColumn()
    id: number
    @ManyToOne(() => PostEntity, PostEntity => PostEntity, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'post_id'})
    post: PostEntity
    @ManyToOne(() => UserEntity, UserEntity => UserEntity, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: 'user_id'})
    user: UserEntity
    @CreateDateColumn({name: 'create_at'})
    createAt: Date
}
