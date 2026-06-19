import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  authResponse,
  userRequest,
  userResponse,
  userSchema,
} from './dto/user.dto';
import { User } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async register(request: userRequest): Promise<authResponse> {
    this.logger.log('Register...');
    const registerRequest: userRequest = this.validationService.validate(
      userSchema,
      request,
    );
    const user: userResponse = await this.create(registerRequest);
    return this.generateToken(user);
  }

  async login(request: userRequest): Promise<authResponse> {
    this.logger.log('Login...');
    const loginRegister: userRequest = this.validationService.validate(
      userSchema,
      request,
    );
    const user: userResponse = await this.getByEmail(loginRegister.email);

    const isMatch: boolean = await bcrypt.compare(
      loginRegister.password,
      user.password,
    );
    if (!isMatch) throw new HttpException('Invalid Email or Password', 400);

    return this.generateToken(user);
  }

  async generateToken(user: userResponse): Promise<authResponse> {
    this.logger.log('Generating token...');
    return {
      token_type: 'Bearer',
      access_token: await this.jwtService.signAsync(user),
    };
  }

  async create(request: userRequest): Promise<User> {
    this.logger.log('Creating new user...');
    const checkDuplicateEmail: userResponse | null =
      await this.prismaService.user.findUnique({
        where: { email: request.email },
      });

    if (checkDuplicateEmail)
      throw new HttpException('Email already exist', 400);

    return this.prismaService.user.create({
      data: {
        email: request.email,
        password: await bcrypt.hash(request.password, Number(process.env.SALT)),
      },
    });
  }

  async getByEmail(email: string): Promise<userResponse> {
    this.logger.log('Getting user...');
    const user: User | null = await this.prismaService.user.findUnique({
      where: { email: email },
    });
    if (!user) throw new HttpException('Invalid Email or Password', 400);
    return user;
  }
}
