import { PrismaService } from '../prisma/prisma.service';
interface ChatMessage {
    role: 'user' | 'ai' | 'assistant';
    content: string;
    timestamp?: string;
}
export declare class ChatService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createSession(userId: string, messages: ChatMessage[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messages: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getUserSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messages: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    updateSession(id: string, messages: ChatMessage[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messages: import("@prisma/client/runtime/library").JsonValue;
    }>;
    private findUserWithRelations;
    private appendAiMessage;
    private buildContextData;
    private buildSystemPrompt;
    private toGroqMessages;
    private generateRealClinicalAiResponse;
}
export {};
