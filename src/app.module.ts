import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailerController } from './mailer/mailer.controller';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({isGlobal: true}), MailerModule],
  controllers: [AppController, MailerController],
  providers: [AppService],
})
export class AppModule {}
