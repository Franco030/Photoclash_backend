import { TournamentRepository } from '../repositories/tournament.repository.js';

export class TournamentService {
  private tournamentRepository: TournamentRepository;

  constructor() {
    this.tournamentRepository = new TournamentRepository();
  }

  async getAllTournaments() {
    return await this.tournamentRepository.getAllTournaments();
  }

  async getTournamentInfo(tournamentId: string) {
    const tournament = await this.tournamentRepository.getTournamentById(tournamentId);
    if (!tournament) {
      throw new Error('Torneo no encontrado.');
    }
    return tournament;
  }

  async closeTournament(tournamentId: string) {
    return await this.tournamentRepository.closeTournament(tournamentId);
  }

  async getTournamentClash(tournamentId: string, currentUserId: string) {
    const competitors = await this.tournamentRepository.getRandomClash(tournamentId, currentUserId);
    if (competitors.length < 2) {
      throw new Error('No hay suficientes fotografías para un duelo.');
    }
    return {
      competitorA: competitors[0],
      competitorB: competitors[1]
    };
  }

  async executeVote(tournamentId: string, currentUserId: string, winnerEntryId: string, loserEntryId: string) {
    return await this.tournamentRepository.registerVoteTransaction(tournamentId, currentUserId, winnerEntryId, loserEntryId);
  }

  async participateInTournament(tournamentId: string, currentUserId: string, imageUrl: string) {
    return await this.tournamentRepository.createPhotoEntry(tournamentId, currentUserId, imageUrl);
  }
}
