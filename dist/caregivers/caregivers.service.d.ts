import { PrismaService } from '../prisma/prisma.service';
export declare class CaregiversService {
    private prisma;
    constructor(prisma: PrismaService);
    createRelation(patientId: string, caregiverId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: string;
        caregiverId: string;
    }>;
    getCaregivers(patientId: string): Promise<({
        caregiver: {
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
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: string;
        caregiverId: string;
    })[]>;
    updateStatus(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: string;
        caregiverId: string;
    }>;
}
