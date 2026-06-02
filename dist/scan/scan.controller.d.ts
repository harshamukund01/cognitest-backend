import { ScanService } from './scan.service';
import { JwtService } from '@nestjs/jwt';
export declare class ScanController {
    private readonly scanService;
    private jwtService;
    constructor(scanService: ScanService, jwtService: JwtService);
    private getUserId;
    uploadScan(authHeader: string, file: Express.Multer.File): Promise<{
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
}
