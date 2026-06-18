import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from '../common/common.module';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { UserController } from './user.controller';

@Module({
  imports: [
    CommonModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
