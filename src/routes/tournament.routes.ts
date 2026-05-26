import { Router } from 'express';
import { TournamentController } from '../controllers/tournament.controller.js';

const router = Router();
const tournamentController = new TournamentController();

router.get('/active', tournamentController.getActive);

export default router;
