import { prisma } from '../config/database.js';

export class TournamentRepository {
  async getAllTournaments() {
    return await prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },

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

  async getTournamentById(id: string) {
    return await prisma.tournament.findUnique({
      where: { id },
      include: {
        photoEntries: {
          orderBy: { votes: 'desc' },
          take: 1, // winner if closed
          include: {
            author: {
              select: { id: true, username: true, avatarUrl: true }
            }
          }
        }
      }
    });
  }

  async closeTournament(id: string) {
    return await prisma.tournament.update({
      where: { id },
      data: { status: 'closed' }
    });
  }

  // Matchmaking 
  async getRandomClash(tournamentId: string, currentUserId: string) {
    const competitors: any[] = await prisma.$queryRaw`
      SELECT id, image_url as "imageUrl"
      FROM photo_entries
      WHERE tournament_id = ${tournamentId}
        AND author_id != ${currentUserId}
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

