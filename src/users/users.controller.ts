import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private getUserId(authHeader: string): string {
    if (!authHeader) throw new UnauthorizedException('Missing Authorization Header');
    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'super-secret-key-12345',
      });
      return decoded.sub;
    } catch {
      throw new UnauthorizedException('Invalid or Expired JWT Token');
    }
  }

  @Get('profile')
  getProfile(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() data: any,
  ) {
    const userId = this.getUserId(authHeader);
    return this.usersService.updateProfile(userId, data);
  }

  @Patch('onboarding/complete')
  completeOnboarding(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.usersService.completeOnboarding(userId);
  }

  @Post('tickets')
  createTicket(
    @Headers('authorization') authHeader: string,
    @Body() data: any,
  ) {
    const userId = this.getUserId(authHeader);
    return this.usersService.createTicket(userId, data);
  }

  @Get('tickets')
  getTickets(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.usersService.getTickets(userId);
  }

  @Get('faqs')
  getFaqs() {
    return this.usersService.getFaqs();
  }
}
