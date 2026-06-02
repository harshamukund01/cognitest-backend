import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class AssessmentsService implements OnModuleInit {
    private prisma;
    private reportsDir;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    create(userId: string, data: any): Promise<{
        assessment: {
            id: string;
            userId: string;
            type: string;
            score: number;
            maxScore: number;
            accuracy: number | null;
            correctAnswers: number | null;
            wrongAnswers: number | null;
            completionTimeMs: number | null;
            reactionTimeMs: number | null;
            memoryScore: number | null;
            logicalScore: number | null;
            speedScore: number | null;
            languageScore: number | null;
            orientationScore: number | null;
            attentionScore: number | null;
            visuospatialScore: number | null;
            dailyLivingScore: number | null;
            caregiverScore: number | null;
            moodScore: number | null;
            completedAt: Date;
            details: import("@prisma/client/runtime/library").JsonValue | null;
        };
        overall: {
            cognitiveScore: number;
            riskLevel: string;
            performanceGrade: string;
            memoryScore: any;
            logicalScore: any;
            speedScore: any;
            languageScore: any;
            orientationScore: any;
            attentionScore: any;
            visuospatialScore: any;
            dailyLivingScore: any;
            caregiverScore: any;
            moodScore: any;
            completedCount: number;
        };
        reportId: string;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        userId: string;
        type: string;
        score: number;
        maxScore: number;
        accuracy: number | null;
        correctAnswers: number | null;
        wrongAnswers: number | null;
        completionTimeMs: number | null;
        reactionTimeMs: number | null;
        memoryScore: number | null;
        logicalScore: number | null;
        speedScore: number | null;
        languageScore: number | null;
        orientationScore: number | null;
        attentionScore: number | null;
        visuospatialScore: number | null;
        dailyLivingScore: number | null;
        caregiverScore: number | null;
        moodScore: number | null;
        completedAt: Date;
        details: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        type: string;
        score: number;
        maxScore: number;
        accuracy: number | null;
        correctAnswers: number | null;
        wrongAnswers: number | null;
        completionTimeMs: number | null;
        reactionTimeMs: number | null;
        memoryScore: number | null;
        logicalScore: number | null;
        speedScore: number | null;
        languageScore: number | null;
        orientationScore: number | null;
        attentionScore: number | null;
        visuospatialScore: number | null;
        dailyLivingScore: number | null;
        caregiverScore: number | null;
        moodScore: number | null;
        completedAt: Date;
        details: import("@prisma/client/runtime/library").JsonValue | null;
    } | null>;
    getReports(userId: string): Promise<{
        id: string;
        userId: string;
        completedAt: Date;
        cognitiveScore: number;
        riskLevel: string;
        performanceGrade: string;
        recommendations: string;
        pdfPath: string | null;
    }[]>;
    getReportPdfFile(reportId: string, userId: string): Promise<string>;
    getDashboardStatus(userId: string): Promise<{
        userName: string;
        overallScore: string;
        riskLevel: string;
        performanceGrade: string;
        streakDays: number;
        completedToday: number;
        recentActivities: {
            id: string;
            title: string;
            score: number;
            maxScore: number;
            type: string;
            completedAt: Date;
        }[];
        memoryScore: any;
        logicalScore: any;
        speedScore: any;
        languageScore: any;
        orientationScore: any;
        attentionScore: any;
        visuospatialScore: any;
        dailyLivingScore: any;
        caregiverScore: any;
        moodScore: any;
    }>;
    getHistoricalTrends(userId: string): Promise<{
        score: number;
        type: string;
        date: string;
    }[]>;
    private updateUserStreak;
    private calculateOverallScore;
    private generateClinicalRecommendations;
    private generateReportPdf;
    getArticles(search?: string, category?: string): Promise<{
        id: string;
        content: string;
        title: string;
        category: string;
        author: string;
        publishDate: Date;
        readingTime: string;
        thumbnail: string;
    }[]>;
    getArticleById(id: string): Promise<{
        id: string;
        content: string;
        title: string;
        category: string;
        author: string;
        publishDate: Date;
        readingTime: string;
        thumbnail: string;
    } | null>;
    submitPreScreening(userId: string, answers: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        riskLevel: string;
        recommendations: string;
        answers: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getPreScreening(userId: string): Promise<{
        id: string;
        userId: string;
        answers: import("@prisma/client/runtime/library").JsonValue;
        riskLevel: string;
        recommendations: any;
        createdAt: Date;
    } | null>;
    submitMeditationSession(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        completedAt: Date;
        durationMinutes: number;
        focusRating: number | null;
        notes: string | null;
    }>;
    getMeditationSessions(userId: string): Promise<{
        id: string;
        userId: string;
        completedAt: Date;
        durationMinutes: number;
        focusRating: number | null;
        notes: string | null;
    }[]>;
}
declare global {
    interface String {
        substringBefore(delimiter: string): string;
    }
}
