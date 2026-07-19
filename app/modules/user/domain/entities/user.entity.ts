import { Entity } from "~/shared/domain/entity";
import type { Email } from "~/modules/user/domain/value-objects/email.vo";

interface UserProps {
  name: string;
  email: Email;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id: string) {
    super(props, id);
  }

  static create(props: UserProps, id: string): User {
    return new User(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }
}
