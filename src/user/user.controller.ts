import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import type { authResponse, userRequest } from './dto/user.dto';

@Controller('/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @HttpCode(200)
  async register(@Body() request: userRequest): Promise<authResponse> {
    return await this.userService.register(request);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() request: userRequest): Promise<authResponse> {
    return await this.userService.login(request);
  }
}
