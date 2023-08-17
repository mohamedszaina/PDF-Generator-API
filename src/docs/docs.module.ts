import { Module } from '@nestjs/common';
import { DocsService } from './docs.service';
import { DocsController } from './docs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocSchema } from './docs.model';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Doc', schema: DocSchema }])],
  controllers: [DocsController],
  providers: [DocsService],
})
export class DocsModule {}
