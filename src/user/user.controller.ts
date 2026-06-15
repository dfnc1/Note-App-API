import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import type {
  createUserRequest,
  updateUserRequest,
  userResponse,
} from './dto/user.dto';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() request: createUserRequest): Promise<userResponse> {
    return this.userService.create(request);
  }

  @Get('/:userId')
  @HttpCode(200)
  async get(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<userResponse> {
    return this.userService.get(userId);
  }

  @Patch('/:userId')
  @HttpCode(200)
  async update(
    @Param(':userId', ParseIntPipe) userId: number,
    @Body() request: updateUserRequest,
  ): Promise<userResponse> {
    return this.userService.update(userId, request);
  }

  @Delete('/:userId')
  @HttpCode(204)
  async remove(@Param('userId') userId: number): Promise<void> {
    return this.userService.remove(userId);
  }
}
