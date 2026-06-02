import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ScanService } from './scan.service';
import { JwtService } from '@nestjs/jwt';

@Controller('scan')
export class ScanController {
  constructor(
    private readonly scanService: ScanService,
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

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadScan(
    @Headers('authorization') authHeader: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = this.getUserId(authHeader);
    
    if (!file) {
      throw new BadRequestException('No MRI scan image or file provided');
    }

    return this.scanService.processAndStoreScan(
      userId,
      file.originalname,
      file.size,
      file.buffer,
    );
  }
}
