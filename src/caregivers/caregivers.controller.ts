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
import { CaregiversService } from './caregivers.service';
import { JwtService } from '@nestjs/jwt';

@Controller('caregivers')
export class CaregiversController {
  constructor(
    private readonly caregiversService: CaregiversService,
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
    @Body('caregiverId') caregiverId: string,
  ) {
    const userId = this.getUserId(authHeader);
    return this.caregiversService.createRelation(userId, caregiverId);
  }

  @Get()
  findAll(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.caregiversService.getCaregivers(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('status') status: string) {
    return this.caregiversService.updateStatus(id, status);
  }
}
