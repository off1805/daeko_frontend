import { useQuery } from "@tanstack/react-query";
import type { UserDTO } from "~/modules/user/application/dto/user.dto";
import { getUserUseCase } from "~/modules/user/infrastructure/user.container";

export function userQueryKey(userId: string) {
  return ["user", userId] as const;
}

export function useUser(userId: string, initialData?: UserDTO) {
  return useQuery({
    queryKey: userQueryKey(userId),
    queryFn: () => getUserUseCase.execute({ userId }),
    initialData,
  });
}
