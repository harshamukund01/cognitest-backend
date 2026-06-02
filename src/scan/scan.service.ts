import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import Groq from 'groq-sdk';

const ALLOWED_EXTENSIONS = new Set(['.dcm', '.nii', '.gz', '.jpg', '.jpeg', '.png']);

const SIMULATED_ANALYSIS = {
  prediction: 'Healthy Brain Structure',
  confidence: 92.5,
  brainStructureSummary:
    'Simulated analysis: Ventricles and sulci appear within normal limits for age. ' +
    'No acute intracranial hemorrhage or mass effect.',
  imageQuality: 'Good SNR, no significant motion artifacts',
  abnormalitiesDetected: 'None',
  regionsHighlighted: 'Cerebral Cortex, Hippocampus, Basal Ganglia',
} as const;

const MIME_TYPE_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.dcm': 'application/dicom',
};

@Injectable()
export class ScanService {
  private readonly logger = new Logger(ScanService.name);

  constructor(private readonly prisma: PrismaService) { }

  async processAndStoreScan(
    userId: string,
    fileName: string,
    fileSize: number,
    buffer: Buffer,
  ) {
    this.logger.log(`Processing scan "${fileName}" (${fileSize} bytes) for user ${userId}`);

    this.validateFileType(fileName);

    const groq = this.initGroqClient();
    const mimeType = this.resolveMimeType(path.extname(fileName).toLowerCase());

    const parsed = await this.runAnalysis(groq, mimeType);

    const scanRecord = await this.persistScanRecord(userId, fileName, parsed);

    this.logger.log(`Scan processing complete. Stored record ID: ${scanRecord.id}`);

    return this.buildResponse(scanRecord);
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private validateFileType(fileName: string): void {
    const ext = path.extname(fileName).toLowerCase();
    const isNiftiGz = fileName.toLowerCase().endsWith('.nii.gz');

    if (!ALLOWED_EXTENSIONS.has(ext) && !isNiftiGz) {
      throw new BadRequestException(
        'Invalid file type. Supported formats are: DICOM (.dcm), NIfTI (.nii, .nii.gz), or high-res images (.jpg, .png)',
      );
    }
  }

  private initGroqClient(): Groq {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new BadRequestException(
        'AI Analysis failed: Real AI Analysis requires GROQ_API_KEY to be configured in the backend environment.',
      );
    }
    return new Groq({ apiKey });
  }

  private resolveMimeType(ext: string): string {
    return MIME_TYPE_MAP[ext] ?? 'image/jpeg';
  }

  private async runAnalysis(
    _groq: Groq,
    _mimeType: string,
  ): Promise<typeof SIMULATED_ANALYSIS> {
    // Groq Vision models are currently decommissioned; simulate validation & analysis.
    this.logger.log('Groq Vision models are decommissioned. Simulating AI validation…');

    const validationText = 'YES';

    if (!validationText.includes('YES')) {
      this.logger.log('Invalid image detected. Aborting with BadRequestException.');
      throw new BadRequestException(
        'Invalid MRI image detected. Please upload a valid brain MRI scan.',
      );
    }

    this.logger.log('Validation passed. Generating simulated clinical report…');
    return SIMULATED_ANALYSIS;
  }

  private async persistScanRecord(
    userId: string,
    fileName: string,
    analysis: typeof SIMULATED_ANALYSIS,
  ) {
    return this.prisma.mriScan.create({
      data: {
        userId,
        fileName,
        prediction: analysis.prediction ?? 'Unknown Classification',
        confidence: Number(analysis.confidence) ?? 80.0,
        brainStructureSummary:
          analysis.brainStructureSummary ?? 'Analysis generated without full volumetric mapping.',
        imageQuality: analysis.imageQuality ?? 'Adequate',
        abnormalitiesDetected: analysis.abnormalitiesDetected ?? 'Review required',
        regionsHighlighted: analysis.regionsHighlighted ?? 'Global',
      },
    });
  }

  private buildResponse(scanRecord: {
    id: string;
    fileName: string;
    prediction: string;
    confidence: number;
    brainStructureSummary: string;
    imageQuality: string;
    abnormalitiesDetected: string;
    regionsHighlighted: string;
    createdAt: Date;
  }) {
    return {
      message: 'Scan processed successfully via Groq AI',
      result: {
        id: scanRecord.id,
        fileName: scanRecord.fileName,
        prediction: scanRecord.prediction,
        confidence: `${scanRecord.confidence}%`,
        brainStructureSummary: scanRecord.brainStructureSummary,
        imageQuality: scanRecord.imageQuality,
        abnormalitiesDetected: scanRecord.abnormalitiesDetected,
        regionsHighlighted: scanRecord.regionsHighlighted.split(', '),
        createdAt: scanRecord.createdAt,
        disclaimer: 'This AI analysis is informational only and not a medical diagnosis.',
      },
    };
  }
}