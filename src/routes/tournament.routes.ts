import { Router } from 'express';
import { TournamentController } from '../controllers/tournament.controller.js';

const router = Router();
const tournamentController = new TournamentController();

router.get('/active', tournamentController.getActive);

router.get('/:id/clash', tournamentController.getClash);
router.post('/:id/vote', tournamentController.castVote);
router.post('/:id/participate', tournamentController.participate);

export default router;