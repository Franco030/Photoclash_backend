import type { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { createUserSchema } from '../schemas/user.schema.js';
import { z, ZodError } from 'zod';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const newUser = await this.userService.registerUser(validatedData);

      res.status(201).json(newUser);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: z.flattenError(error).fieldErrors });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  };



  getRanking = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const ranking = await this.userService.getRanking(limit);
      res.json(ranking);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener el ranking global.' });
    }
  };

  getDashboard = async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.headers['x-user-id'] as string;

    if (!currentUserId) {
      res.status(401).json({ error: 'Falta x-user-id en la cabecera.' });
      return;
    }

    try {
      const dashboardData = await this.userService.getDashboard(currentUserId);
      res.json(dashboardData);
    } catch (error: any) {
      res.status(500).json({ error: 'Error al obtener el dashboard.' });
    }
  };
}