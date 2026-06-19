import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
