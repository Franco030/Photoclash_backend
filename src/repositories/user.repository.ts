import { prisma } from '../config/database.js';
import type { CreateUserInput } from '../schemas/user.schema.js';

export class UserRepository {
  async create(data: CreateUserInput) {
    return await prisma.user.create({
      data: {
        username: data.username,
        title: data.title,
        avatarUrl: data.avatarUrl ?? null,
      },
    });
  }

  async findByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }
}
