import { UserStatus } from "@/domain/constants/UserStatus";

export interface IUserProps {
  id: string;
  username: string;
  email: string;
  fullName: string;
  status: UserStatus;
  urlPicture: string | null; // Dấu ? nghĩa là có thể có hoặc không
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
}

