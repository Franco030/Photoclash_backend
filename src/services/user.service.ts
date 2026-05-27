import { UserRepository } from '../repositories/user.repository.js';
import type { CreateUserInput } from '../schemas/user.schema.js';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(data: CreateUserInput) {
    const existingUser = await this.userRepository.findByUsername(data.username);

    if (existingUser) {
      throw new Error('El nombre de usuario ya está en uso');
    }

    return await this.userRepository.create(data);
  }

  async getUserProfile(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  async updateUserProfile(id: string, data: Partial<CreateUserInput>) {
    // Si se está cambiando el username, validar que no esté en uso por otra persona
    if (data.username) {
      const existing = await this.userRepository.findByUsername(data.username);
      if (existing && existing.id !== id) {
        throw new Error('El nombre de usuario ya está en uso');
      }
    }

    return await this.userRepository.update(id, data);
  }

  async getRanking(limit: number) {
    return await this.userRepository.getGlobalRanking(limit);
  }

  async getDashboard(userId: string) {
    const data = await this.userRepository.getUserDashboardData(userId);

    return {
      winRate: data.stats.winRate,
      totalUploads: data.stats.totalUploads,
      photos: data.uploads.map( p => ({
        id: p.id,
        tournamentId: p.tournamentId,
        imageUrl: p.imageUrl,
        votes: p.votes,
        submittedAt: p.submittedAt
      }))
    }
  }

}
