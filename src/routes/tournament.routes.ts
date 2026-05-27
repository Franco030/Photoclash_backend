import { Router } from 'express';
import { TournamentController } from '../controllers/tournament.controller.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = Router();
const tournamentController = new TournamentController();

router.get('/', tournamentController.getActive);

router.get('/:id/clash', tournamentController.getClash);
router.post('/:id/vote', tournamentController.castVote);
router.post('/:id/participate', upload.single('image'), tournamentController.participate);

export default router;