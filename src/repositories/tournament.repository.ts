import { prisma } from '../config/database.js';

export class TournamentRepository {
  async getActiveTournament() {
    return await prisma.tournament.findFirst({
      where: {
        status: 'active'
      },

      include: {
        photoEntries: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });
  }
}
