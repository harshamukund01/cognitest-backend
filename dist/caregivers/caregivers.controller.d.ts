import { CaregiversService } from './caregivers.service';
import { JwtService } from '@nestjs/jwt';
export declare class CaregiversController {
    private readonly caregiversService;
    private jwtService;
    constructor(caregiversService: CaregiversService, jwtService: JwtService);
    private getUserId;
    create(authHeader: string, caregiverId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: string;
        caregiverId: string;
    }>;
    findAll(authHeader: string): Promise<({
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
    update(id: string, status: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        patientId: string;
        caregiverId: string;
    }>;
}
