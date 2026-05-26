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
}
