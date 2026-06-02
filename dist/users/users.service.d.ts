import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<({
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
    updateProfile(userId: string, data: any): Promise<{
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
    completeOnboarding(userId: string): Promise<{
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
    createTicket(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        subject: string;
        message: string;
        status: string;
    }>;
    getTickets(userId: string): Promise<{
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
