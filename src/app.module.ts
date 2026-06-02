import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { CaregiversModule } from './caregivers/caregivers.module';
import { ChatModule } from './chat/chat.module';
import { ScanModule } from './scan/scan.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    AssessmentsModule,
    CaregiversModule,
    ChatModule,
    ScanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
