import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';

@Module({
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
