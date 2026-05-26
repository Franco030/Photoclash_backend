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
}
