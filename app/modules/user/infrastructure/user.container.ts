import { HttpUserRepository } from "~/modules/user/infrastructure/repositories/http-user.repository";
import { GetUserUseCase } from "~/modules/user/application/use-cases/get-user.use-case";

const userRepository = new HttpUserRepository();

export const getUserUseCase = new GetUserUseCase(userRepository);
