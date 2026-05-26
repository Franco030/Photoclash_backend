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

  // Matchmaking 
  async getRandomClash(tournamentId: string, currentUserId: string) {
    const competitors: any[] = await prisma.$queryRaw`
      SELECT id, image_url as "imageUrl"
      FROM photo_entries
      WHERE tournament_id = ${tournamentId} AND author_id != ${currentUserId}
      ORDER BY RAND()
      LIMIT 2
    `;
    return competitors;
  }

  async registerVoteTransaction(tournamentId: string, currentUserId: string, winnerEntryId: string, loserEntryId: string) {
    return await prisma.$transaction(async (tx) => {
      const winnerPhoto = await tx.photoEntry.findUnique({
        where: { id: winnerEntryId },
        select: { authorId: true }
      });

      if (winnerPhoto?.authorId === currentUserId) {
        throw new Error('No puedes votar por tu propia fotografía.');
      }

      await tx.vote.create({
        data: {
          tournamentId,
          winnerEntryId,
          loserEntryId,
          voterId: currentUserId
        }
      });

      await tx.photoEntry.update({
        where: { id: winnerEntryId },
        data: {
          votes: { increment: 1 }
        }
      });
    });
  }

  async createPhotoEntry(tournamentId: string, authorId: string, imageUrl: string) {
    return await prisma.photoEntry.create({
      data: {
        tournamentId: tournamentId,
        authorId: authorId,
        imageUrl: imageUrl,
        votes: 0
      }
    });
  }
}

