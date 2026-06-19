import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Note, User } from '../generated/prisma/client';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteUser(): Promise<void> {
    await this.prismaService.user.deleteMany({
      where: {
        email: 'test@gmail',
      },
    });
  }

  async createUser(): Promise<void> {
    await this.prismaService.user.create({
      data: {
        email: 'test@gmail',
        password: await bcrypt.hash('test', 10),
      },
    });
  }

  async getUser(): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: {
        email: 'test@gmail',
      },
    });
  }

  async deleteNote(): Promise<void> {
    await this.prismaService.note.deleteMany({
      where: {
        user: {
          email: 'test@gmail',
        },
      },
    });
  }

  async createNote(): Promise<void> {
    const user: User | null = await this.getUser();
    await this.prismaService.note.create({
      data: {
        title: 'test title',
        content: 'test content',
        user_id: user!.id,
      },
    });
  }

  async getNote(): Promise<Note | null> {
    return await this.prismaService.note.findFirst({
      where: {
        user: {
          email: 'test@gmail',
        },
      },
    });
  }
}
