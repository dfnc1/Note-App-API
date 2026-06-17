import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from '../common/common.module';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';

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
  exports: [UserService],
})
export class UserModule {}
