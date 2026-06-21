import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { NoteModule } from './note/note.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [UserModule, NoteModule, CommonModule],
})
export class AppModule {}
