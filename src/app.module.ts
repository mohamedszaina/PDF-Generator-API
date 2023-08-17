import 'dotenv/config';
// import * as dotenv from 'dotenv';
// dotenv.config({ path: './config.env' });
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocsModule } from './docs/docs.module';
import mongoose from 'mongoose';

// console.log('DATABASE:', process.env.DATABASE);
// console.log('DATABASE_PAS:', process.env.DATABASE_PAS);
// Check if environment variables are loaded
if (!process.env.DATABASE || !process.env.DATABASE_PAS) {
  throw new Error('Missing or undefined environment variables');
}
//DB
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PAS);

mongoose.set('strictQuery', false);
mongoose.connect(DB).then((con) => {
  // console.log(con.connections);
  console.log('DB successfully connected! 👍');
});

@Module({
  imports: [MongooseModule.forRoot(DB), DocsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
