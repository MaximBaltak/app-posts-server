import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors({
    origin: 'http://localhost:8083',
    credentials: true,
    methods:['GET','POST','PUT','DELETE','HEADER','PATCH','OPTIONS']
  })
  const config = new DocumentBuilder()
      .setTitle('Документация API app-posts-server')
      .setDescription('Описание API с примерами для app-posts-server')
      .setVersion('1.0')
      .addCookieAuth('auth',{type:"apiKey"})
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`server start on port ${process.env.APP_PORT}`);
  });
}
bootstrap();
