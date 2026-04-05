import { RoleResponseDTO } from "./user.dto";

export interface UserResponseDTO {
    readonly id: string;
    readonly username: string;
    readonly email: string;
    readonly fullName: string;
    readonly urlPicture: string;
    readonly phoneNumber: string;
    readonly status: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly roles: RoleResponseDTO[];
}
