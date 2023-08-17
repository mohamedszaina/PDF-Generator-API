import 'dotenv/config';
// import * as dotenv from 'dotenv';
// dotenv.config({ path: './config.env' });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// server
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const message = () => {
    console.log(`http://localhost:${port}`);
  };
  await app.listen(port, message);
}
bootstrap();
