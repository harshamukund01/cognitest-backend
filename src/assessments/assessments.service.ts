import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument = require('pdfkit');
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AssessmentsService implements OnModuleInit {
  private reportsDir: string;

  constructor(private prisma: PrismaService) {
    // Set up local reports directory securely inside the backend workspace
    this.reportsDir = path.join(__dirname, '..', '..', 'reports');
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  async onModuleInit() {
    const count = await this.prisma.article.count();
    if (count === 0) {
      await this.prisma.article.createMany({
        data: [
          {
            title: "Understanding Alzheimer's Early Signs",
            category: "Prevention",
            content: "Cognitive health is a critical component of overall well-being as we age. While some minor memory lapses are a normal part of the aging process, significant cognitive decline can indicate underlying medical conditions like Alzheimer's that require clinical intervention. Early warning signs include asking the same question repeatedly, getting lost in familiar places, or having difficulty handling familiar tasks. Staying physically active, maintaining strong social connections, and treating chronic illnesses can reduce the risk of cognitive decline.",
            author: "Dr. Elena Rodriguez",
            readingTime: "5 min read",
            thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=300&q=80"
          },
          {
            title: "Improving Cognitive Function with Diet",
            category: "Nutrition",
            content: "The MIND diet aims to prevent dementia and slow the loss of brain function that can happen with age. It combines the Mediterranean diet and the DASH diet to create a dietary pattern focused specifically on brain health. Key foods include green leafy vegetables, all other vegetables, nuts, berries, beans, whole grains, fish, poultry, olive oil, and wine in moderation. Research indicates that adhering to the MIND diet can significantly slow down cognitive aging and lower the risk of cognitive impairment.",
            author: "Dr. Elena Rodriguez",
            readingTime: "8 min read",
            thumbnail: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=300&q=80"
          },
          {
            title: "The Role of Sleep in Brain Health",
            category: "Lifestyle",
            content: "Sleep is crucial for cognitive restoration, memory consolidation, and physiological waste clearance in the brain. During deep sleep, the brain's glymphatic system clears metabolic waste products, including amyloid-beta proteins that form brain plaques. Chronically poor sleep increases the risk of cognitive decline, memory impairment, and focus deficiencies. Aim for 7 to 9 hours of high-quality, uninterrupted sleep nightly to support baseline memory and cognitive processing velocity.",
            author: "Dr. Elena Rodriguez",
            readingTime: "6 min read",
            thumbnail: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=300&q=80"
          },
          {
            title: "Communicating with Compassion in Caregiving",
            category: "Caregiving",
            content: "Supporting a loved one through memory or cognitive challenges requires patience, adaptation, and deep compassion. When communication gaps or memory lapses occur, avoid direct corrections or arguing. Instead, use clear, simple sentences, maintain eye contact, and validate their feelings. Create a structured daily routine to reduce anxiety, and keep the living environment free of major noise distractions. Support groups are also key for caregivers to preserve their own emotional wellness.",
            author: "Dr. Elena Rodriguez",
            readingTime: "10 min read",
            thumbnail: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=300&q=80"
          },
          {
            title: "The Power of Social Connection",
            category: "Prevention",
            content: "Humans are inherently social creatures, and staying active in your community is one of the most effective defenses against cognitive decline. Engaging in meaningful conversations, joining support groups, or practicing hobbies with others stimulates neural plasticity. Social engagement helps keep the brain active, reduces stress levels, and mitigates feelings of depression or loneliness, which are closely linked to cognitive impairment. Try joining a local book club, volunteering, or scheduling weekly family visits.",
            author: "Dr. Elena Rodriguez",
            readingTime: "5 min read",
            thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80"
          }
        ]
      });
      console.log('Seeded 5 educational articles successfully.');
    }
  }

  async create(userId: string, data: any) {
    const type = data.type?.toUpperCase() || 'MEMORY';
    const score = Number(data.score) || 0;
    const maxScore = Number(data.maxScore) || 10;
    const correctAnswers = Number(data.correctAnswers) || score;
    const wrongAnswers = Number(data.wrongAnswers) || 0;
    const completionTimeMs = Number(data.completionTimeMs) || 30000;
    const reactionTimeMs = Number(data.reactionTimeMs) || 300;

    // 1. Calculate dynamic clinical scoring indices
    let accuracy = (correctAnswers / maxScore) * 100;
    if (accuracy > 100) accuracy = 100;
    if (accuracy < 0) accuracy = 0;

    let memoryScore: number | null = null;
    let logicalScore: number | null = null;
    let speedScore: number | null = null;
    let languageScore: number | null = null;
    let orientationScore: number | null = null;
    let attentionScore: number | null = null;
    let visuospatialScore: number | null = null;
    let dailyLivingScore: number | null = null;
    let caregiverScore: number | null = null;
    let moodScore: number | null = null;

    if (!data.details) data.details = {};
    data.details.accuracyVal = Math.round(accuracy).toString();

    if (type === 'MEMORY') {
      // Memory Index (0-100) combining accuracy and penalty for errors
      memoryScore = Math.max(0, Math.min(100, Math.round(accuracy - (wrongAnswers * 5))));
      data.details.formula = "Memory Score = Accuracy - (Wrong Answers * 5)";
      data.details.wrongPenalty = (wrongAnswers * 5).toString();
      data.details.consistencyVal = "90";
    } else if (type === 'LOGIC') {
      // Logic Index (0-100) combining accuracy and speed efficiency
      const speedEfficiency = Math.max(20, Math.min(100, 120 - Math.round(completionTimeMs / 1000)));
      logicalScore = Math.max(0, Math.min(100, Math.round((accuracy * 0.7) + (speedEfficiency * 0.3))));
      data.details.formula = "Logic Score = (Accuracy * 0.7) + (Speed Efficiency * 0.3)";
      data.details.speedVal = speedEfficiency.toString();
      data.details.consistencyVal = "92";
    } else if (type === 'SPEED') {
      // Speed Index (0-100) combining reaction timing statistics
      let baseSpeedScore = 100;
      if (reactionTimeMs > 300) {
        baseSpeedScore = Math.max(30, 100 - Math.round((reactionTimeMs - 300) / 10));
      }
      speedScore = Math.max(0, Math.min(100, Math.round((baseSpeedScore * 0.6) + (accuracy * 0.4))));
      data.details.formula = "Speed Score = (Base Reaction Score * 0.6) + (Accuracy * 0.4)";
      data.details.speedVal = baseSpeedScore.toString();
      data.details.consistencyVal = "88";
    } else if (type === 'LANGUAGE') {
      // Dynamic evaluation from actual user speech transcript!
      const transcript = data.details?.transcript || data.details?.recalledWords || '';
      const words = transcript.split(/\s+/).map((w: string) => w.toLowerCase().replace(/[^a-z]/g, '')).filter((w: string) => w.length > 0);
      
      const totalWords = words.length;
      const uniqueWords = new Set(words).size;
      const vocabularyRichness = totalWords > 0 ? (uniqueWords / totalWords) * 100 : 0;
      
      // Calculate repetition rate
      let repeatedCount = 0;
      const seen = new Set<string>();
      for (const w of words) {
        if (seen.has(w)) repeatedCount++;
        seen.add(w);
      }
      const repetitionRate = totalWords > 0 ? (repeatedCount / totalWords) * 100 : 0;
      
      // Clinical relevant keywords for park scene
      const keywords = ['park', 'sun', 'sunny', 'tree', 'trees', 'person', 'people', 'lemon', 'lemons', 'apple', 'apples', 'market', 'stall', 'child', 'children', 'dog', 'bench', 'grass', 'sky'];
      const matchedKeywords = keywords.filter(k => words.includes(k)).length;
      const completeness = keywords.length > 0 ? (matchedKeywords / keywords.length) * 100 : 0;

      // Clarity (simulated dynamic metric or based on recognition)
      const clarity = Math.max(70, Math.min(100, 100 - (repetitionRate * 0.5) + (vocabularyRichness * 0.1)));

      // Compute verbal fluency, quality, grammar, and final scores
      const verbalFluency = Math.round((vocabularyRichness * 0.6) + (Math.max(0, 100 - repetitionRate) * 0.4));
      const speechQuality = Math.round((Math.min(100, totalWords * 8) * 0.4) + (clarity * 0.4) + (completeness * 0.2));
      const grammarLevel = Math.round(Math.min(100, 75 + (uniqueWords * 2)));

      languageScore = Math.max(0, Math.min(100, Math.round((verbalFluency * 0.4) + (speechQuality * 0.3) + (grammarLevel * 0.3))));
      
      data.details.verbalFluency = verbalFluency.toString();
      data.details.vocabularyRichness = vocabularyRichness.toFixed(1) + '%';
      data.details.repetitionRate = repetitionRate.toFixed(1) + '%';
      data.details.speechQuality = speechQuality.toString();
      data.details.completeness = completeness.toFixed(1) + '%';
      data.details.clarity = clarity.toFixed(1) + '%';
      data.details.grammarLevel = grammarLevel.toString();
      data.details.transcript = transcript;
      data.details.formula = "Language Score = (Verbal Fluency * 0.4) + (Speech Quality * 0.3) + (Grammar Level * 0.3)";
      data.details.consistencyVal = "85";
    } else if (type === 'ORIENTATION') {
      orientationScore = Math.max(0, Math.min(100, Math.round(accuracy)));
    } else if (type === 'ATTENTION') {
      attentionScore = Math.max(0, Math.min(100, Math.round(accuracy)));
    } else if (type === 'VISUOSPATIAL') {
      visuospatialScore = Math.max(0, Math.min(100, Math.round(accuracy)));
    } else if (type === 'DAILY_LIVING') {
      dailyLivingScore = Math.max(0, Math.min(100, Math.round(accuracy)));
    } else if (type === 'CAREGIVER') {
      caregiverScore = Math.max(0, Math.min(100, Math.round(accuracy)));
    } else if (type === 'MOOD') {
      moodScore = Math.max(0, Math.min(100, Math.round(accuracy)));
    }

    // 2. Save assessment record in SQLite
    const assessment = await this.prisma.assessment.create({
      data: {
        userId,
        type,
        score,
        maxScore,
        accuracy,
        correctAnswers,
        wrongAnswers,
        completionTimeMs,
        reactionTimeMs,
        memoryScore,
        logicalScore,
        speedScore,
        languageScore,
        orientationScore,
        attentionScore,
        visuospatialScore,
        dailyLivingScore,
        caregiverScore,
        moodScore,
        details: data.details,
      },
    });

    // 3. Track and increment user dynamic daily active streak
    await this.updateUserStreak(userId);

    // 4. Trigger Dynamic Cognitive Health Score compilation
    const summary = await this.calculateOverallScore(userId);

    // 5. Generate Clinical recommendations list based on health summary
    const recommendations = this.generateClinicalRecommendations(summary.cognitiveScore, type);

    // 6. Save Clinical Report meta to database
    const report = await this.prisma.report.create({
      data: {
        userId,
        cognitiveScore: summary.cognitiveScore,
        riskLevel: summary.riskLevel,
        performanceGrade: summary.performanceGrade,
        recommendations: JSON.stringify(recommendations),
      },
    });

    // 7. Render dynamic styled PDF Report securely on disk
    try {
      await this.generateReportPdf(userId, report.id, summary, recommendations, assessment);
      await this.prisma.report.update({
        where: { id: report.id },
        data: { pdfPath: `/reports/${report.id}.pdf` },
      });
    } catch (pdfError) {
      console.error('Failed to compile PDF Report:', pdfError);
    }

    return {
      assessment,
      overall: summary,
      reportId: report.id,
    };
  }

  async findAll(userId: string) {
    return this.prisma.assessment.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.assessment.findUnique({
      where: { id },
    });
  }

  async getReports(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }

  async getReportPdfFile(reportId: string, userId: string): Promise<string> {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report || report.userId !== userId) {
      throw new BadRequestException('Report not found or access denied');
    }

    const pdfFile = path.join(this.reportsDir, `${reportId}.pdf`);
    if (!fs.existsSync(pdfFile)) {
      throw new BadRequestException('PDF file is not compiled on disk');
    }

    return pdfFile;
  }

  async getDashboardStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) throw new BadRequestException('User not found');

    const assessments = await this.findAll(userId);
    const overall = await this.calculateOverallScore(userId);

    // Group tasks completed today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const completedTodayCount = assessments.filter(ast => new Date(ast.completedAt) >= startOfToday).length;

    // Recent Activity mapping
    const recentActivities = assessments.slice(0, 5).map(ast => {
      let title = 'Cognitive Checkup';
      if (ast.type === 'MEMORY') title = 'Memory Sprint Test';
      else if (ast.type === 'LOGIC') title = 'Pattern Logic Test';
      else if (ast.type === 'SPEED') title = 'Reaction Speed Test';
      else if (ast.type === 'LANGUAGE') title = 'Verbal Language Test';

      return {
        id: ast.id,
        title,
        score: ast.score,
        maxScore: ast.maxScore,
        type: ast.type,
        completedAt: ast.completedAt,
      };
    });

    return {
      userName: user.profile?.fullName || user.profile?.firstName || 'User',
      overallScore: overall.cognitiveScore > 0 ? overall.cognitiveScore.toString() : 'Pending',
      riskLevel: overall.riskLevel,
      performanceGrade: overall.performanceGrade,
      streakDays: user.streakDays,
      completedToday: completedTodayCount,
      recentActivities,
      memoryScore: overall.memoryScore,
      logicalScore: overall.logicalScore,
      speedScore: overall.speedScore,
      languageScore: overall.languageScore,
      orientationScore: overall.orientationScore,
      attentionScore: overall.attentionScore,
      visuospatialScore: overall.visuospatialScore,
      dailyLivingScore: overall.dailyLivingScore,
      caregiverScore: overall.caregiverScore,
      moodScore: overall.moodScore
    };
  }

  async getHistoricalTrends(userId: string) {
    const assessments = await this.prisma.assessment.findMany({
      where: { userId },
      orderBy: { completedAt: 'asc' },
    });

    // Group assessments by week/month to generate trend coordinates
    const trends = assessments.map(ast => ({
      score: ast.memoryScore || ast.logicalScore || ast.speedScore || ast.languageScore || ast.orientationScore || ast.attentionScore || ast.visuospatialScore || ast.dailyLivingScore || ast.caregiverScore || ast.moodScore || (ast.score / ast.maxScore * 100),
      type: ast.type,
      date: ast.completedAt.toISOString().split('T')[0],
    }));

    return trends;
  }

  // HELPER METHODS

  private async updateUserStreak(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (!user.lastActiveDate) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { streakDays: 1, lastActiveDate: now },
      });
      return;
    }

    const lastActiveStr = user.lastActiveDate.toISOString().split('T')[0];

    if (todayStr === lastActiveStr) {
      return; // Already active today, streak stays the same
    }

    const diffTime = Math.abs(now.getTime() - user.lastActiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = user.streakDays;
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1; // Streak broken
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { streakDays: newStreak, lastActiveDate: now },
    });
  }

  private async calculateOverallScore(userId: string) {
    const latestAssessments = await this.prisma.assessment.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    // Extract the latest assessment score for each type
    const latestByType = new Map<string, any>();
    for (const a of latestAssessments) {
      if (!latestByType.has(a.type)) {
        latestByType.set(a.type, a);
      }
    }

    const memoryScore = latestByType.get('MEMORY')?.memoryScore ?? null;
    const logicalScore = latestByType.get('LOGIC')?.logicalScore ?? null;
    const speedScore = latestByType.get('SPEED')?.speedScore ?? null;
    const languageScore = latestByType.get('LANGUAGE')?.languageScore ?? null;
    const orientationScore = latestByType.get('ORIENTATION')?.orientationScore ?? null;
    const attentionScore = latestByType.get('ATTENTION')?.attentionScore ?? null;
    const visuospatialScore = latestByType.get('VISUOSPATIAL')?.visuospatialScore ?? null;
    const dailyLivingScore = latestByType.get('DAILY_LIVING')?.dailyLivingScore ?? null;
    const caregiverScore = latestByType.get('CAREGIVER')?.caregiverScore ?? null;
    const moodScore = latestByType.get('MOOD')?.moodScore ?? null;

    let sum = 0;
    let count = 0;
    if (memoryScore !== null) { sum += memoryScore; count++; }
    if (logicalScore !== null) { sum += logicalScore; count++; }
    if (speedScore !== null) { sum += speedScore; count++; }
    if (languageScore !== null) { sum += languageScore; count++; }
    if (orientationScore !== null) { sum += orientationScore; count++; }
    if (attentionScore !== null) { sum += attentionScore; count++; }
    if (visuospatialScore !== null) { sum += visuospatialScore; count++; }
    if (dailyLivingScore !== null) { sum += dailyLivingScore; count++; }
    if (caregiverScore !== null) { sum += caregiverScore; count++; }
    if (moodScore !== null) { sum += moodScore; count++; }

    const cognitiveScore = count > 0 ? Math.round(sum / count) : 0;

    let riskLevel = 'PENDING';
    let performanceGrade = 'N/A';

    if (count > 0) {
      if (cognitiveScore >= 90) performanceGrade = 'A';
      else if (cognitiveScore >= 80) performanceGrade = 'B';
      else if (cognitiveScore >= 70) performanceGrade = 'C';
      else if (cognitiveScore >= 60) performanceGrade = 'D';
      else performanceGrade = 'F';

      if (cognitiveScore >= 80) {
        riskLevel = 'LOW';
      } else if (cognitiveScore >= 60) {
        riskLevel = 'MCI';
      } else {
        riskLevel = 'HIGH';
      }
    }

    return {
      cognitiveScore,
      riskLevel,
      performanceGrade,
      memoryScore: memoryScore ?? 0,
      logicalScore: logicalScore ?? 0,
      speedScore: speedScore ?? 0,
      languageScore: languageScore ?? 0,
      orientationScore: orientationScore ?? 0,
      attentionScore: attentionScore ?? 0,
      visuospatialScore: visuospatialScore ?? 0,
      dailyLivingScore: dailyLivingScore ?? 0,
      caregiverScore: caregiverScore ?? 0,
      moodScore: moodScore ?? 0,
      completedCount: count
    };
  }

  private generateClinicalRecommendations(score: number, type: string): string[] {
    const list: string[] = [];
    if (score >= 85) {
      list.push('Maintain active physical routines with 150 minutes of aerobic exercise weekly.');
      list.push('Engage in high-level logical reasoning activities such as strategic gaming or complex puzzles.');
    } else if (score >= 70) {
      list.push('Incorporate memory recall drills twice daily to baseline brain neuroplasticity.');
      list.push('Consult clinical physicians for a demographically standardized cognitive screening.');
      list.push('Monitor sleep wellness to optimize daily latency scores.');
    } else {
      list.push('URGENT: Arrange a comprehensive neurocognitive evaluation with specialists.');
      list.push('Adopt closely supervised caregiver assistance for daily cognitive activities.');
      list.push('Initiate high-frequency visual and language recall exercises daily.');
    }

    if (type === 'MEMORY') list.push('Use structured mnemonic associations during memory recall tasks.');
    if (type === 'LOGIC') list.push('Practice visual grid mapping templates to boost logical reasoning.');

    return list;
  }

  private generateReportPdf(
    userId: string,
    reportId: string,
    summary: any,
    recommendations: string[],
    latestAssessment: any,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          include: { profile: true },
        });

        const assessments = await this.prisma.assessment.findMany({
          where: { userId },
          orderBy: { completedAt: 'asc' },
        });

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const pdfFile = path.join(this.reportsDir, `${reportId}.pdf`);
        const writeStream = fs.createWriteStream(pdfFile);

        doc.pipe(writeStream);

        // Header Styling
        doc.fillColor('#003B73')
           .fontSize(24)
           .font('Helvetica-Bold')
           .text('CogniTest Performance Report', { align: 'left' });
        
        doc.fontSize(9)
           .fillColor('#757575')
           .font('Helvetica')
           .text('COGNITIVE TRAJECTORY & PERFORMANCE REPORTING', { align: 'left' });

        doc.moveDown(1.0);
        doc.strokeColor('#E0E0E0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1.0);

        // User Information & Assessment Date
        doc.fontSize(11)
           .fillColor('#333333')
           .font('Helvetica-Bold')
           .text('USER PROFILE & ASSESSMENT CONTEXT');
        doc.moveDown(0.3);

        const email = user?.email || 'N/A';
        const name = `${user?.profile?.firstName || 'User'} ${user?.profile?.lastName || ''}`.trim();
        const dateStr = new Date().toLocaleDateString('en-US', { dateStyle: 'long' });

        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#555555')
           .text(`User Full Name: ${name}`)
           .text(`Email Address: ${email}`)
           .text(`Assessment Compilation Date: ${dateStr}`);

        doc.moveDown(1.0);
        doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1.0);

        // Cognitive Index Section (Card)
        doc.rect(50, doc.y, 495, 75).fill('#F1F8FF');
        
        doc.fillColor('#003B73')
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('COGNITIVE PERFORMANCE INDEX (0-100)', 70, doc.y + 12);

        doc.fontSize(28)
           .text(`${summary.cognitiveScore}`, 70, doc.y + 8);
        
        doc.fontSize(10)
           .fillColor('#555555')
           .font('Helvetica-Bold')
           .text(`Grade: ${summary.performanceGrade}   |   Classification: ${summary.riskLevel}`, 140, doc.y - 18);

        doc.moveDown(3.0);

        // Results Section for all 4 Domains
        doc.fontSize(11)
           .fillColor('#333333')
           .font('Helvetica-Bold')
           .text('COGNITIVE SUB-DOMAIN METRICS', 50, doc.y);
        doc.moveDown(0.5);

        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#555555');

        const formatScore = (val: any) => val !== undefined && val !== null && val > 0 ? `${Math.round(val)}/100` : 'Not Completed';

        doc.text(`• Memory Domain Recall Index: ${formatScore(summary.memoryScore)}`);
        doc.text(`• Logic Pattern Recognition Index: ${formatScore(summary.logicalScore)}`);
        doc.text(`• Reaction Speed Response Index: ${formatScore(summary.speedScore)}`);
        doc.text(`• Verbal Language Fluency Index: ${formatScore(summary.languageScore)}`);
        doc.text(`• Orientation Awareness Index: ${formatScore(summary.orientationScore)}`);
        doc.text(`• Attention & Working Memory Index: ${formatScore(summary.attentionScore)}`);
        doc.text(`• Visuospatial Ability Index: ${formatScore(summary.visuospatialScore)}`);
        doc.text(`• Daily Living Independence Index: ${formatScore(summary.dailyLivingScore)}`);
        doc.text(`• Caregiver Observation Index: ${formatScore(summary.caregiverScore)}`);
        doc.text(`• Mood & Depression Index: ${formatScore(summary.moodScore)}`);

        doc.moveDown(1.0);
        doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1.0);

        // Improvement Trend
        doc.fontSize(11)
           .fillColor('#333333')
           .font('Helvetica-Bold')
           .text('HISTORICAL TRAJECTORY TRENDS');
        doc.moveDown(0.5);

        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#555555');

        if (assessments.length <= 1) {
          doc.text('No historical trajectory available. Perform regular checkups weekly to map cognitive changes.');
        } else {
          doc.text(`Analyzed ${assessments.length} assessment records over time.`);
          const recent = assessments.slice(-3).map(a => `${a.type} (${Math.round(a.score)}/${a.maxScore} on ${a.completedAt.toISOString().split('T')[0]})`);
          doc.text(`Recent records: ${recent.join(', ')}`);
        }

        doc.moveDown(1.0);
        doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1.0);

        // Recommendations
        doc.fontSize(11)
           .fillColor('#333333')
           .font('Helvetica-Bold')
           .text('RECOMMENDED BRAIN TRAINING ACTIVITIES');
        doc.moveDown(0.5);

        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#555555');

        recommendations.forEach((rec) => {
          doc.text(`• ${rec}`);
        });

        doc.moveDown(1.5);
        doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
        doc.moveDown(1.5);

        // Clinical Disclaimer
        doc.fontSize(9)
           .fillColor('#999999')
           .font('Helvetica-Bold')
           .text('CLINICAL DISCLAIMER & SAFETY NOTICE', { align: 'center' });
        doc.moveDown(0.3);
        doc.font('Helvetica')
           .text('This is a non-clinical screening index designed for cognitive wellness tracking. It does not represent a volumetric MRI scan, neurological structural checkup, speech fluency pathology, or medical diagnosis. Please consult qualified medical professionals for physical diagnostics or diagnosis.', { align: 'center', width: 495 });

        doc.end();

        writeStream.on('finish', () => resolve());
        writeStream.on('error', (err) => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  async getArticles(search?: string, category?: string) {
    const where: any = {};
    if (category && category !== 'All Resources') {
      where.category = { equals: category };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    return this.prisma.article.findMany({
      where,
      orderBy: { publishDate: 'desc' },
    });
  }

  async getArticleById(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
    });
  }

  async submitPreScreening(userId: string, answers: any) {
    let oftenCount = 0;
    let sometimesCount = 0;
    const recsSet = new Set<string>();

    // Memory Domain (appointments, names)
    if (answers.forgetAppointments === 'Often' || answers.forgetNames === 'Often') {
      oftenCount++;
      recsSet.add('Memory & Recall');
    } else if (answers.forgetAppointments === 'Sometimes' || answers.forgetNames === 'Sometimes') {
      sometimesCount++;
      recsSet.add('Memory & Recall');
    }

    // Attention Domain (easily distracted, lose focus)
    if (answers.easilyDistracted === 'Often' || answers.loseFocus === 'Often') {
      oftenCount++;
      recsSet.add('Logic Assessment');
      recsSet.add('Speed Assessment');
    } else if (answers.easilyDistracted === 'Sometimes' || answers.loseFocus === 'Sometimes') {
      sometimesCount++;
      recsSet.add('Logic Assessment');
      recsSet.add('Speed Assessment');
    }

    // Language Domain (difficulty finding words)
    if (answers.difficultyFindingWords === 'Often') {
      oftenCount++;
      recsSet.add('Language & Fluency');
    } else if (answers.difficultyFindingWords === 'Sometimes') {
      sometimesCount++;
      recsSet.add('Language & Fluency');
    }

    // Executive Domain (trouble planning tasks)
    if (answers.troublePlanningTasks === 'Often') {
      oftenCount++;
      recsSet.add('Executive Function');
    } else if (answers.troublePlanningTasks === 'Sometimes') {
      sometimesCount++;
      recsSet.add('Executive Function');
    }

    let riskLevel = 'LOW';
    if (oftenCount >= 2) {
      riskLevel = 'HIGH';
    } else if (oftenCount >= 1 || sometimesCount >= 2) {
      riskLevel = 'MODERATE';
    }

    if (recsSet.size === 0) {
      recsSet.add('Memory & Recall');
    }

    const recommendations = Array.from(recsSet);

    return this.prisma.preScreening.upsert({
      where: { userId },
      update: {
        answers,
        riskLevel,
        recommendations: JSON.stringify(recommendations),
      },
      create: {
        userId,
        answers,
        riskLevel,
        recommendations: JSON.stringify(recommendations),
      },
    });
  }

  async getPreScreening(userId: string) {
    const ps = await this.prisma.preScreening.findUnique({
      where: { userId },
    });
    if (!ps) return null;
    return {
      id: ps.id,
      userId: ps.userId,
      answers: ps.answers,
      riskLevel: ps.riskLevel,
      recommendations: JSON.parse(ps.recommendations || '[]'),
      createdAt: ps.createdAt,
    };
  }
  async submitMeditationSession(userId: string, data: any) {
    const durationMinutes = Number(data.durationMinutes) || 0;
    const focusRating = data.focusRating ? Number(data.focusRating) : null;
    return this.prisma.meditationSession.create({
      data: {
        userId,
        durationMinutes,
        focusRating,
        notes: data.notes || '',
      },
    });
  }

  async getMeditationSessions(userId: string) {
    return this.prisma.meditationSession.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }
}

// Simple Kotlin helper mapping standard Kotlin utilities inside JS
declare global {
  interface String {
    substringBefore(delimiter: string): string;
  }
}
String.prototype.substringBefore = function(delimiter: string): string {
  const idx = this.indexOf(delimiter);
  return idx === -1 ? this.toString() : this.substring(0, idx);
};
