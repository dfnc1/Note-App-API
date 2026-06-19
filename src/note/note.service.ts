import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  createNoteRequest,
  createNoteSchema,
  noteResponse,
  updateNoteRequest,
  updateNoteSchema,
} from './dto/note.dto';
import { Note, User } from '../../generated/prisma/client';
import { UserService } from '../user/user.service';

@Injectable()
export class NoteService {
  private logger: Logger = new Logger(NoteService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationService: ValidationService,
    private userService: UserService,
  ) {}

  toNoteResponse(note: Note): noteResponse {
    this.logger.log(`Get response...`);
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      createdAt: note.create_at,
      updatedAt: note.update_at,
    };
  }

  async checkNotesIfExist(userId: number, noteId: number): Promise<Note> {
    this.logger.log(`Check exist...`);
    const note: Note | null = await this.prismaService.note.findFirst({
      where: {
        id: noteId,
        user_id: userId,
      },
    });
    if (!note) throw new HttpException('Note is not found', 400);
    return note;
  }

  async create(user: User, request: createNoteRequest): Promise<noteResponse> {
    this.logger.log(`Create note request...`);
    const createRequest: createNoteRequest = this.validationService.validate(
      createNoteSchema,
      request,
    );
    await this.userService.getByEmail(user.email);
    const note: Note = await this.prismaService.note.create({
      data: createRequest,
    });
    return this.toNoteResponse(note);
  }

  async get(user: User, noteId: number): Promise<noteResponse> {
    this.logger.log(`Getting note request...`);
    await this.userService.getByEmail(user.email);
    const note: Note = await this.checkNotesIfExist(user.id, noteId);
    return this.toNoteResponse(note);
  }

  async update(user: User, request: updateNoteRequest): Promise<noteResponse> {
    this.logger.log(`Update note request...`);
    const updateRequest: updateNoteRequest = this.validationService.validate(
      updateNoteSchema,
      request,
    );
    await this.userService.getByEmail(user.email);
    let note: Note | null = await this.checkNotesIfExist(
      user.id,
      updateRequest.id,
    );

    note = await this.prismaService.note.update({
      where: {
        id: note.id,
        user_id: note.user_id,
      },
      data: updateRequest,
    });
    return this.toNoteResponse(note);
  }

  async remove(user: User, noteId: number): Promise<void> {
    this.logger.log(`Remove note request...`);
    await this.userService.getByEmail(user.email);
    const note: Note = await this.checkNotesIfExist(user.id, noteId);
    await this.prismaService.note.delete({
      where: {
        id: note.id,
        user_id: note.user_id,
      },
    });
  }

  async list(user: User): Promise<noteResponse[]> {
    this.logger.log(`Listing note request...`);
    await this.userService.getByEmail(user.email);
    const notes: Note[] = await this.prismaService.note.findMany({
      where: {
        user_id: user.id,
      },
    });
    return notes.map((note: Note): noteResponse => this.toNoteResponse(note));
  }
}
