import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import type {
  createNoteRequest,
  noteResponse,
  updateNoteRequest,
} from './dto/note.dto';
import { Auth } from '../common/auth.decorator';
import type { User } from '../../generated/prisma/client';
import { AuthGuard } from '../common/auth.guard';

@Controller('/note')
@UseGuards(AuthGuard)
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Body() request: createNoteRequest,
  ): Promise<noteResponse> {
    return await this.noteService.create(user, request);
  }

  @Patch()
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: updateNoteRequest,
  ): Promise<noteResponse> {
    return await this.noteService.update(user, request);
  }

  @Get()
  @HttpCode(200)
  async list(@Auth() user: User): Promise<noteResponse[]> {
    return await this.noteService.list(user);
  }

  @Get('/:noteId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('noteId', ParseIntPipe) noteId: number,
  ): Promise<noteResponse> {
    return await this.noteService.get(user, noteId);
  }

  @Delete('/:noteId')
  @HttpCode(204)
  async remove(
    @Auth() user: User,
    @Param('noteId', ParseIntPipe) noteId: number,
  ): Promise<void> {
    return await this.noteService.remove(user, noteId);
  }
}
