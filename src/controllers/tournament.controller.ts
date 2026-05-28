import type { Request, Response } from 'express';
import { TournamentService } from '../services/tournament.service.js';

export class TournamentController {
  private tournamentService: TournamentService;

  constructor() {
    this.tournamentService = new TournamentService();
  }

  getAll = async (_: Request, res: Response): Promise<void> => {
    try {
      const tournaments = await this.tournamentService.getAllTournaments();
      res.json(tournaments);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  getInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const tournament = await this.tournamentService.getTournamentInfo(req.params.id as string);
      res.json(tournament);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  closeTournament = async (req: Request, res: Response): Promise<void> => {
    try {
      const tournament = await this.tournamentService.closeTournament(req.params.id as string);
      res.json(tournament);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getClash = async (req: Request, res: Response): Promise<void> => {
    const tournamentId = req.params.id as string;
    const currentUserId = req.headers['x-user-id'] as string;

    if (!tournamentId || !currentUserId) {
      res.status(400).json({ error: 'Faltan parámetros de identificación.' });
      return;
    }

    try {
      const clashData = await this.tournamentService.getTournamentClash(tournamentId, currentUserId);
      res.json(clashData);
    } catch (error: any) {
      const status = error.message.includes('suficientes') ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  };

  castVote = async (req: Request, res: Response): Promise<void> => {
    const tournamentId = req.params.id as string;
    const currentUserId = req.headers['x-user-id'] as string;
    const { winnerEntryId, loserEntryId } = req.body;

    if (!winnerEntryId || !loserEntryId || !tournamentId || !currentUserId) {
      res.status(400).json({ error: 'Payload de votación incompleto.' });
      return;
    }

    try {
      await this.tournamentService.executeVote(tournamentId, currentUserId, winnerEntryId, loserEntryId);
      res.status(201).json({ status: 'success', message: 'Voto procesado correctamente.' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  participate = async (req: Request, res: Response): Promise<void> => {
    const tournamentId = req.params.id as string;
    const currentUserId = req.headers['x-user-id'] as string;
    
    const host = req.get('x-forwarded-host') || req.get('host');
    const baseUrl = process.env.API_BASE_URL || `${req.protocol}://${host}`;
    const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : req.body.imageUrl;

    if (!tournamentId || !currentUserId || !imageUrl) {
      res.status(400).json({ error: 'Faltan datos obligatorios para participar.' });
      return;
    }

    try {
      const newEntry = await this.tournamentService.participateInTournament(tournamentId, currentUserId, imageUrl);
      res.status(201).json(newEntry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}