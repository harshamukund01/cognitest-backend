import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  private getUserId(authHeader: string): string {
    if (!authHeader) throw new UnauthorizedException();
    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'super-secret-key-12345',
      });
      return decoded.sub;
    } catch {
      throw new UnauthorizedException();
    }
  }

  @Post()
  create(
    @Headers('authorization') authHeader: string,
    @Body('messages') messages: any[],
  ) {
    const userId = this.getUserId(authHeader);
    return this.chatService.createSession(userId, messages);
  }

  @Get()
  findAll(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.chatService.getUserSessions(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('messages') messages: any[]) {
    return this.chatService.updateSession(id, messages);
  }
}
