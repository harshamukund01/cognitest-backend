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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
    }
    async updateProfile(userId, data) {
        const profileData = { ...data };
        if (profileData.age !== undefined && profileData.age !== null) {
            profileData.age = Number(profileData.age);
        }
        return this.prisma.profile.upsert({
            where: { userId },
            update: profileData,
            create: { userId, ...profileData },
        });
    }
    async completeOnboarding(userId) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isOnboarded: true },
        });
    }
    async createTicket(userId, data) {
        return this.prisma.supportTicket.create({
            data: {
                userId,
                subject: data.subject || 'Support Ticket',
                message: data.message || '',
            },
        });
    }
    async getTickets(userId) {
        return this.prisma.supportTicket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getFaqs() {
        return [
            {
                question: "How is the Cognitive Health Score calculated?",
                answer: "The score aggregates your memory sprint, pattern logic, and response speed indexes into a unified clinical scale (0-100)."
            },
            {
                question: "What is Mild Cognitive Impairment (MCI)?",
                answer: "MCI refers to a slight but noticeable decline in memory or thinking skills, representing an intermediate stage between normal aging and more significant changes."
            },
            {
                question: "How do I share assessments with my caregiver?",
                answer: "Navigate to Support, tap 'Invite Caregiver', and type their email. Once they register, they can securely view your diagnostic metrics."
            }
        ];
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map