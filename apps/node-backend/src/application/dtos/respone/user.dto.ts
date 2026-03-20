export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  fullName: string;
  urlPicture: string | null;
  status: string;
  createdAt: Date;
}