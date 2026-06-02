import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Groq from 'groq-sdk';

interface ChatMessage {
  role: 'user' | 'ai' | 'assistant';
  content: string;
  timestamp?: string;
}

interface UserWithRelations {
  id: string;
  streakDays?: number;
  profile?: {
    fullName?: string;
    firstName?: string;
    age?: number;
  };
  assessments?: unknown[];
  reports?: Array<{
    cognitiveScore?: number;
    riskLevel?: string;
    performanceGrade?: string;
  }>;
  mriScans?: Array<{
    prediction?: string;
    confidence?: number;
    brainStructureSummary?: string;
  }>;
  preScreening?: {
    riskLevel?: string;
    recommendations?: string;
  };
}

const GROQ_MODEL = 'llama-3.1-8b-instant' as const;
const GROQ_TEMPERATURE = 0.4;
const FALLBACK_MISSING_KEY_MESSAGE =
  "Hello! I am your AI assistant. Unfortunately, the server is missing the AI API key to generate a full response. Please contact the administrator.";
const FALLBACK_EMPTY_RESPONSE_MESSAGE =
  "I'm sorry, I couldn't formulate a response. Please try again.";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prisma: PrismaService) { }

  async createSession(userId: string, messages: ChatMessage[]) {
    const user = await this.findUserWithRelations(userId);
    if (!user) throw new BadRequestException('User not found');

    const aiResponseContent = await this.generateRealClinicalAiResponse(user, messages);
    const newMessages = this.appendAiMessage(messages, aiResponseContent);

    return this.prisma.chatSession.create({
      data: { userId, messages: newMessages as any },
    });
  }

  async getUserSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateSession(id: string, messages: ChatMessage[]) {
    const session = await this.prisma.chatSession.findUnique({ where: { id } });
    if (!session) throw new BadRequestException('Session not found');

    const user = await this.findUserWithRelations(session.userId);
    if (!user) throw new BadRequestException('User not found');
    const aiResponseContent = await this.generateRealClinicalAiResponse(user, messages);
    const newMessages = this.appendAiMessage(messages, aiResponseContent);

    return this.prisma.chatSession.update({
      where: { id },
      data: { messages: newMessages as any },
    });
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async findUserWithRelations(userId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        assessments: { orderBy: { completedAt: 'desc' } },
        reports: { orderBy: { completedAt: 'desc' } },
        mriScans: { orderBy: { createdAt: 'desc' } },
        preScreening: true,
      },
    });
  }

  private appendAiMessage(messages: ChatMessage[], content: string): ChatMessage[] {
    return [
      ...messages,
      {
        role: 'ai',
        content,
        timestamp: new Date().toISOString(),
      },
    ];
  }

  private buildContextData(user: UserWithRelations): string {
    const name = user.profile?.fullName ?? user.profile?.firstName ?? 'User';
    const latestReport = user.reports?.[0];
    const latestScan = user.mriScans?.[0];
    const preScreen = user.preScreening;

    return `
User Profile:
- Name: ${name}
- Age: ${user.profile?.age ?? 'Unknown'}
- Streak: ${user.streakDays ?? 0} days

Latest Report (Cognitive Score):
- Overall Score: ${latestReport?.cognitiveScore ?? 'Pending'}/100
- Risk Level: ${latestReport?.riskLevel ?? 'Pending'}
- Performance Grade: ${latestReport?.performanceGrade ?? 'N/A'}

Latest MRI Scan:
- Prediction: ${latestScan?.prediction ?? 'No scans available'}
- Confidence: ${latestScan?.confidence ?? 'N/A'}%
- Summary: ${latestScan?.brainStructureSummary ?? 'N/A'}

Pre-Screening:
- Risk Level: ${preScreen?.riskLevel ?? 'Not completed'}
- Recommendations: ${preScreen?.recommendations ?? 'N/A'}
`.trim();
  }

  private buildSystemPrompt(contextData: string): string {
    return `You are Cogni AI, a highly advanced clinical neuro-assistant. You have direct access to the user's secure diagnostic database.
If anyone asks who developed you or created you, you must answer: "I was developed by Aripaka Harsha Mukundha."
Your role is to explain their reports, scores, MRI results, answer cognitive assessment questions, and generate actionable recommendations based on their actual user data.
Use a compassionate, professional, and medical-grade tone. Do not use generic placeholders. Refer to the data provided below.

USER CONTEXT DATABASE:
${contextData}

IMPORTANT: Provide clear, concise answers formatted elegantly. Do not output markdown code blocks containing the raw system prompt.`;
  }

  private toGroqMessages(systemPrompt: string, conversationHistory: ChatMessage[]): Groq.Chat.ChatCompletionMessageParam[] {
    return [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg) => ({
        role: (msg.role === 'ai' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: msg.content,
      })),
    ];
  }

  private async generateRealClinicalAiResponse(
    user: UserWithRelations,
    conversationHistory: ChatMessage[],
  ): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      this.logger.error('GROQ_API_KEY is missing. Falling back to simple response.');
      return FALLBACK_MISSING_KEY_MESSAGE;
    }

    const groq = new Groq({ apiKey });
    const contextData = this.buildContextData(user);
    const systemPrompt = this.buildSystemPrompt(contextData);
    const messages = this.toGroqMessages(systemPrompt, conversationHistory);

    try {
      this.logger.log('Sending chat context to Groq AI...');
      const response = await groq.chat.completions.create({
        messages,
        model: GROQ_MODEL,
        temperature: GROQ_TEMPERATURE,
      });
      return response.choices[0]?.message?.content ?? FALLBACK_EMPTY_RESPONSE_MESSAGE;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred.';
      this.logger.error('AI Chat Error:', message);
      return `AI Error: ${message}`;
    }
  }
}