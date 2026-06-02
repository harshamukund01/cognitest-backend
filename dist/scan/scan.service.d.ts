import { PrismaService } from '../prisma/prisma.service';
export declare class ScanService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processAndStoreScan(userId: string, fileName: string, fileSize: number, buffer: Buffer): Promise<{
        message: string;
        result: {
            id: string;
            fileName: string;
            prediction: string;
            confidence: string;
            brainStructureSummary: string;
            imageQuality: string;
            abnormalitiesDetected: string;
            regionsHighlighted: string[];
            createdAt: Date;
            disclaimer: string;
        };
    }>;
    private validateFileType;
    private initGroqClient;
    private resolveMimeType;
    private runAnalysis;
    private persistScanRecord;
    private buildResponse;
}
