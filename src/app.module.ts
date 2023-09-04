import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthService } from './user/auth/auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
