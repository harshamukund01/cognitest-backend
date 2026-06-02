import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }

  async updateProfile(userId: string, data: any) {
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

  async completeOnboarding(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isOnboarded: true },
    });
  }

  async createTicket(userId: string, data: any) {
    return this.prisma.supportTicket.create({
      data: {
        userId,
        subject: data.subject || 'Support Ticket',
        message: data.message || '',
      },
    });
  }

  async getTickets(userId: string) {
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
}
