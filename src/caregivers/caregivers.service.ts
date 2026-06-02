import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaregiversService {
  constructor(private prisma: PrismaService) {}

  async createRelation(patientId: string, caregiverId: string) {
    return this.prisma.caregiverRelation.create({
      data: {
        patientId,
        caregiverId,
      },
    });
  }

  async getCaregivers(patientId: string) {
    return this.prisma.caregiverRelation.findMany({
      where: { patientId },
      include: {
        caregiver: { select: { id: true, email: true, profile: true } },
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.caregiverRelation.update({
      where: { id },
      data: { status },
    });
  }
}
