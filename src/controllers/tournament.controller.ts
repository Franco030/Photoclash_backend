import type { Request, Response } from 'express';
import { TournamentService } from '../services/tournament.service.js';

export class TournamentController {
  private tournamentService: TournamentService;

  constructor() {
    this.tournamentService = new TournamentService();
  }

  getActive = async (_: Request, res: Response): Promise<void> => {
    try {
      const tournament = await this.tournamentService.getActiveTournament();
      res.json(tournament);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
