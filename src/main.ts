import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`server start on port ${process.env.APP_PORT}`);
  });
}
bootstrap();
