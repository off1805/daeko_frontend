import type { UseCase } from "~/shared/domain/use-case";
import type { UserRepository } from "~/modules/user/domain/repositories/user.repository";
import { UserNotFoundError } from "~/modules/user/domain/errors/user-not-found.error";
import { toUserDTO, type UserDTO } from "~/modules/user/application/dto/user.dto";

interface GetUserInput {
  userId: string;
}

export class GetUserUseCase implements UseCase<GetUserInput, UserDTO> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: GetUserInput): Promise<UserDTO> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return toUserDTO(user);
  }
}
