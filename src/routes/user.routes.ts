import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();
const userController = new UserController();

router.post('/', userController.create);

router.get('/ranking', userController.getRanking);
router.get('/me/dashboard', userController.getDashboard);

export default router;