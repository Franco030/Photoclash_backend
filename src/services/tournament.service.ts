import { TournamentRepository } from '../repositories/tournament.repository.js';

export class TournamentService {
  private tournamentRepository: TournamentRepository;

  constructor() {
    this.tournamentRepository = new TournamentRepository();
  }

  async getActiveTournament() {
    const tournament = await this.tournamentRepository.getActiveTournament();

    if (!tournament) {
      throw new Error('No hay torneos activos en este momento.');
    }

    return tournament;
  }
}
