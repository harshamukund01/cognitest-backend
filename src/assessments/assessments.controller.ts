import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Res,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';

@Controller('assessments')
export class AssessmentsController {
  constructor(
    private readonly assessmentsService: AssessmentsService,
    private jwtService: JwtService,
  ) {}

  private getUserId(authHeader: string, fallbackToken?: string): string {
    const token = (authHeader ? authHeader.split(' ')[1] : fallbackToken) || '';
    if (!token) throw new UnauthorizedException('Missing Authorization Header or Query Token');
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'super-secret-key-12345',
      });
      return decoded.sub;
    } catch {
      throw new UnauthorizedException('Invalid or Expired JWT Token');
    }
  }

  @Post('submit')
  create(
    @Headers('authorization') authHeader: string,
    @Body() createAssessmentDto: any,
  ) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.create(userId, createAssessmentDto);
  }

  @Get('dashboard')
  getDashboard(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.getDashboardStatus(userId);
  }

  @Get('reports')
  getReports(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.getReports(userId);
  }

  @Get('reports/download/:id')
  async downloadReport(
    @Headers('authorization') authHeader: string,
    @Query('token') queryToken: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const userId = this.getUserId(authHeader, queryToken);
    const filePath = await this.assessmentsService.getReportPdfFile(id, userId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CogniTest_Report_${id}.pdf"`);
    
    return res.sendFile(filePath);
  }

  @Get('articles')
  getArticles(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.assessmentsService.getArticles(search, category);
  }

  @Get('articles/:id')
  getArticleById(@Param('id') id: string) {
    return this.assessmentsService.getArticleById(id);
  }

  @Get('trends')
  getTrends(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.getHistoricalTrends(userId);
  }

  @Post('pre-screening')
  submitPreScreening(
    @Headers('authorization') authHeader: string,
    @Body() answers: any,
  ) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.submitPreScreening(userId, answers);
  }

  @Get('pre-screening')
  getPreScreening(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.getPreScreening(userId);
  }

  @Post('meditation')
  submitMeditationSession(
    @Headers('authorization') authHeader: string,
    @Body() sessionData: any,
  ) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.submitMeditationSession(userId, sessionData);
  }

  @Get('meditation')
  getMeditationSessions(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.getMeditationSessions(userId);
  }

  // Legacy mappings for backwards-compatibility with old screens
  @Post()
  createLegacy(
    @Headers('authorization') authHeader: string,
    @Body() createAssessmentDto: any,
  ) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.create(userId, createAssessmentDto);
  }

  @Get()
  findAll(@Headers('authorization') authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.assessmentsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }
}
