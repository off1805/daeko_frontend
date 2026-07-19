import type { User } from "~/modules/user/domain/entities/user.entity";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email.toString(),
  };
}
