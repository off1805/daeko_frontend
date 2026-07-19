import type { User } from "~/modules/user/domain/entities/user.entity";

export interface UserRepository {
  getById(id: string): Promise<User | null>;
}
