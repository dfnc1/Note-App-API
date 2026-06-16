import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  updateUserRequest,
  updateUserSchema,
  userRequest,
  userResponse,
  userSchema,
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

  async create(request: userRequest): Promise<userResponse> {
    this.logger.debug(`UserService.create(${JSON.stringify(request)})`);
    const createRequest: userRequest = this.validationService.validate(
      userSchema,
      request,
    );

    const checkDuplicateEmail: userResponse | null =
      await this.prismaService.user.findUnique({
        where: { email: createRequest.email },
      });

    if (checkDuplicateEmail)
      throw new HttpException('Email already exist', 400);

    return this.prismaService.user.create({
      data: {
        email: createRequest.email,
        password: await bcrypt.hash(
          createRequest.password,
          Number(process.env.SALT),
        ),
      },
    });
  }

  async getByEmail(email: string): Promise<userResponse> {
    this.logger.debug(`UserService.get(${JSON.stringify(email)})`);
    const user: User | null = await this.prismaService.user.findUnique({
      where: { email: email },
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
    return this.prismaService.user.update({
      where: { id: id },
      data: user,
    });
  }
}
