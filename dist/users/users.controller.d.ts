import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
export declare class UsersController {
    private readonly usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    private getUserId;
    getProfile(authHeader: string): Promise<({
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string | null;
            lastName: string | null;
            fullName: string | null;
            dob: Date | null;
            age: number | null;
            gender: string | null;
            language: string | null;
            educationLevel: string | null;
            country: string | null;
            medicalHistory: import("@prisma/client/runtime/library").JsonValue | null;
            lifestyleInfo: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        otp: string | null;
        otpExpiry: Date | null;
        streakDays: number;
        lastActiveDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        isOnboarded: boolean;
    }) | null>;
    updateProfile(authHeader: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        firstName: string | null;
        lastName: string | null;
        fullName: string | null;
        dob: Date | null;
        age: number | null;
        gender: string | null;
        language: string | null;
        educationLevel: string | null;
        country: string | null;
        medicalHistory: import("@prisma/client/runtime/library").JsonValue | null;
        lifestyleInfo: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    completeOnboarding(authHeader: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        otp: string | null;
        otpExpiry: Date | null;
        streakDays: number;
        lastActiveDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        isOnboarded: boolean;
    }>;
    createTicket(authHeader: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        subject: string;
        message: string;
        status: string;
    }>;
    getTickets(authHeader: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        subject: string;
        message: string;
        status: string;
    }[]>;
    getFaqs(): Promise<{
        question: string;
        answer: string;
    }[]>;
}
