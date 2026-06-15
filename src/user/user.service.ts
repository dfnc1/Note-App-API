import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  createUserRequest,
  createUserSchema,
  updateUserRequest,
  updateUserSchema,
  userResponse,
} from './dto/user.dto';
import { User } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(request: createUserRequest): Promise<userResponse> {
    this.logger.debug(`UserService.create(${JSON.stringify(request)})`);
    const createRequest: createUserRequest = this.validationService.validate(
      createUserSchema,
      request,
    );

    const checkDuplicateEmail: userResponse | null =
      await this.prismaService.user.findUnique({
        where: { email: createRequest.email },
      });

    if (checkDuplicateEmail)
      throw new HttpException('Email already exist', 400);

    const result: User = await this.prismaService.user.create({
      data: {
        email: createRequest.email,
        password: await bcrypt.hash(
          createRequest.password,
          Number(process.env.SALT),
        ),
      },
    });
    return {
      id: result.id,
      email: result.email,
    };
  }

  async get(id: number): Promise<userResponse> {
    this.logger.debug(`UserService.get(${JSON.stringify(id)})`);
    const user: User | null = await this.prismaService.user.findFirst({
      where: { id: id },
    });
    if (!user) throw new HttpException('Email not found', 400);
    return user;
  }

  async update(id: number, request: updateUserRequest): Promise<userResponse> {
    this.logger.debug(`UserService.create(${JSON.stringify(request)})`);
    const updateRequest: updateUserRequest = this.validationService.validate(
      updateUserSchema,
      request,
    );
    const user: User | null = await this.prismaService.user.findFirst({
      where: { id: id },
    });
    if (!user) throw new HttpException('User not found', 400);
    if (updateRequest.email) user.email = updateRequest.email;
    if (updateRequest.password)
      user.password = await bcrypt.hash(
        updateRequest.password,
        Number(process.env.SALT),
      );
    const result: User = await this.prismaService.user.update({
      where: { id: id },
      data: user,
    });
    return {
      id: result.id,
      email: result.email,
    };
  }

  async remove(id: number): Promise<void> {
    this.logger.debug(`UserService.delete(${JSON.stringify(id)})`);
    const user: User | null = await this.prismaService.user.findFirst({
      where: {
        id: id,
      },
    });
    if (!user) throw new HttpException('User not found', 400);
    await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
  }
}
