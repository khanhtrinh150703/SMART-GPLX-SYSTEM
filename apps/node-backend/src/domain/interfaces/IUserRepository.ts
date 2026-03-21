import { User } from '../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByUserName(id: string): Promise<User | null>;
  checkUserExists(email: string, username: string): Promise<User | null>;
  create(data: User): Promise<User | null>;
  update(user: User): Promise<User>;
}