import { UserStatus } from "../entities/User";

export interface IUserProps {
  id: string;
  username: string;
  email: string;
  fullName: string;
  status: UserStatus;
  urlPicture: string | null; // Dấu ? nghĩa là có thể có hoặc không
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
}

