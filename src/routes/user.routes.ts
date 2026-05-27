import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();
const userController = new UserController();

router.post('/', userController.create);
router.get('/me', userController.getProfile);
router.put('/me', upload.single('avatar'), userController.updateProfile);

router.get('/ranking', userController.getRanking);
router.get('/me/dashboard', userController.getDashboard);

export default router;