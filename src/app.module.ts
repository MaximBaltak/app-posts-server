import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionDB } from "../database/tyoeorm.config";

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
