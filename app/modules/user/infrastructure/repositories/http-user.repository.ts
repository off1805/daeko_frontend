import { User } from "~/modules/user/domain/entities/user.entity";
import { Email } from "~/modules/user/domain/value-objects/email.vo";
import type { UserRepository } from "~/modules/user/domain/repositories/user.repository";

interface RemoteUser {
  id: number;
  name: string;
  email: string;
}

export class HttpUserRepository implements UserRepository {
  constructor(
    private readonly baseUrl = "https://jsonplaceholder.typicode.com",
  ) {}

  async getById(id: string): Promise<User | null> {
    const response = await fetch(`${this.baseUrl}/users/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch user ${id}: ${response.statusText}`);
    }
    const data = (await response.json()) as RemoteUser;
    return User.create(
      { name: data.name, email: Email.create(data.email) },
      String(data.id),
    );
  }
}
