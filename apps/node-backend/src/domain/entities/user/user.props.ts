import { UserStatus } from "./user.status";

export interface IUserProps {
  id: string;
  username: string;
  email: string;
  fullName: string | null;  
  phoneNumber: string | null;      // Phải có | null
  passwordHash: string ;  // Phải có | null
  status: UserStatus;
  urlPicture: string | null;    // Phải có | null
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;       // Phải có | null
}