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

  async getDashboard(userId: string) {
    const data = await this.userRepositiry.getUserDashboardData(userId);

    return{
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
