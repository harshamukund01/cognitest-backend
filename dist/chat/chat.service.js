"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const GROQ_MODEL = 'llama-3.1-8b-instant';
const GROQ_TEMPERATURE = 0.4;
const FALLBACK_MISSING_KEY_MESSAGE = "Hello! I am your AI assistant. Unfortunately, the server is missing the AI API key to generate a full response. Please contact the administrator.";
const FALLBACK_EMPTY_RESPONSE_MESSAGE = "I'm sorry, I couldn't formulate a response. Please try again.";
let ChatService = ChatService_1 = class ChatService {
    prisma;
    logger = new common_1.Logger(ChatService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSession(userId, messages) {
        const user = await this.findUserWithRelations(userId);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const aiResponseContent = await this.generateRealClinicalAiResponse(user, messages);
        const newMessages = this.appendAiMessage(messages, aiResponseContent);
        return this.prisma.chatSession.create({
            data: { userId, messages: newMessages },
        });
    }
    async getUserSessions(userId) {
        return this.prisma.chatSession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateSession(id, messages) {
        const session = await this.prisma.chatSession.findUnique({ where: { id } });
        if (!session)
            throw new common_1.BadRequestException('Session not found');
        const user = await this.findUserWithRelations(session.userId);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const aiResponseContent = await this.generateRealClinicalAiResponse(user, messages);
        const newMessages = this.appendAiMessage(messages, aiResponseContent);
        return this.prisma.chatSession.update({
            where: { id },
            data: { messages: newMessages },
        });
    }
    async findUserWithRelations(userId) {
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
    appendAiMessage(messages, content) {
        return [
            ...messages,
            {
                role: 'ai',
                content,
                timestamp: new Date().toISOString(),
            },
        ];
    }
    buildContextData(user) {
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
    buildSystemPrompt(contextData) {
        return `You are Cogni AI, a highly advanced clinical neuro-assistant. You have direct access to the user's secure diagnostic database.
If anyone asks who developed you or created you, you must answer: "I was developed by Aripaka Harsha Mukundha."
Your role is to explain their reports, scores, MRI results, answer cognitive assessment questions, and generate actionable recommendations based on their actual user data.
Use a compassionate, professional, and medical-grade tone. Do not use generic placeholders. Refer to the data provided below.

USER CONTEXT DATABASE:
${contextData}

IMPORTANT: Provide clear, concise answers formatted elegantly. Do not output markdown code blocks containing the raw system prompt.`;
    }
    toGroqMessages(systemPrompt, conversationHistory) {
        return [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.map((msg) => ({
                role: (msg.role === 'ai' ? 'assistant' : 'user'),
                content: msg.content,
            })),
        ];
    }
    async generateRealClinicalAiResponse(user, conversationHistory) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            this.logger.error('GROQ_API_KEY is missing. Falling back to simple response.');
            return FALLBACK_MISSING_KEY_MESSAGE;
        }
        const groq = new groq_sdk_1.default({ apiKey });
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
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred.';
            this.logger.error('AI Chat Error:', message);
            return `AI Error: ${message}`;
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map