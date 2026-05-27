import { prisma } from '../config/database.js';
import type { CreateUserInput } from '../schemas/user.schema.js';

export class UserRepository {
  async create(data: CreateUserInput) {
    return await prisma.user.create({
      data: {
        username: data.username,
        title: data.title,
        avatarUrl: data.avatarUrl ?? null,
      },
    });
  }

  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<CreateUserInput>) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async getGlobalRanking(limit: number) {
    return await prisma.user.findMany({
      orderBy: { 
        score: 'desc' 
      },
      take: limit,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        title: true,
        score: true,
        winRate: true
      }
    });
  }

  async getUserDashboardData(userID: string){
    const userStats = await prisma.user.findUnique({
      where: { id: userID},
      select: {
        winRate: true,
        _count: {
          select: { photoEntries: true }
        } 
      }
    });
    const uploads = await prisma.photoEntry.findMany({
      where: { authorId: userID },
      orderBy: { submittedAt: 'desc' },
    });
    return { 
      stats: {
        winRate: userStats?.winRate ?? 0,
        totalUploads: userStats?._count.photoEntries ?? 0
      },
      uploads
    };
  }

}
