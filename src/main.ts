import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
    }),
  });
  await app.listen(Number(process.env.PORT));
}

bootstrap().catch((err) => {
  console.error(err);
});
