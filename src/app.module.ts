import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionDB } from "../database/tyoeorm.config";
import { AuthModule } from './modules/auth/auth.module';
import { AuthController } from './modules/auth/auth.controller';

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
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
