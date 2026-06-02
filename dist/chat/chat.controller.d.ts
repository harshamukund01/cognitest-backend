import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
export declare class ChatController {
    private readonly chatService;
    private jwtService;
    constructor(chatService: ChatService, jwtService: JwtService);
    private getUserId;
    create(authHeader: string, messages: any[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messages: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(authHeader: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messages: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    update(id: string, messages: any[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        messages: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
