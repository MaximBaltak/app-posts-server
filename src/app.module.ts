import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {connectionDB} from "../database/tyoeorm.config";
import {AuthModule} from './modules/auth/auth.module';
import {UsersModule} from './modules/users/users.module';
import {PostsModule} from "./modules/posts/posts.module";
import {CommentsModule} from "./modules/comments/comments.module";
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            ...connectionDB,
            autoLoadEntities: true
        }),
        AuthModule,
        UsersModule,
        PostsModule,
        CommentsModule
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
