import { DomainError } from "~/shared/domain/domain-error";

export class UserNotFoundError extends DomainError {
  readonly code = "USER_NOT_FOUND";

  constructor(userId: string) {
    super(`User with id "${userId}" was not found`);
  }
}
