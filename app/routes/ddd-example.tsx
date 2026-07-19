import type { Route } from "./+types/ddd-example";
import { Button } from "~/components/ui/button";
import { getUserUseCase, useUser, UserCard } from "~/modules/user/presentation";

export function meta() {
  return [{ title: "Exemple d'architecture DDD" }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const user = await getUserUseCase.execute({ userId: "1" });
  return { user };
}

export default function DddExample({ loaderData }: Route.ComponentProps) {
  const { user: initialUser } = loaderData;
  const { data: user, isFetching, refetch } = useUser(
    initialUser.id,
    initialUser,
  );

  return (
    <div className="mx-auto max-w-md space-y-4 p-8">
      <div>
        <h1 className="text-xl font-semibold">
          Module &quot;user&quot; — exemple DDD
        </h1>
        <p className="text-sm text-muted-foreground">
          Chargement initial via le loader React Router (SSR), revalidation
          via TanStack Query côté client.
        </p>
      </div>
      {user && <UserCard user={user} />}
      <Button
        type="button"
        variant="outline"
        onClick={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? "Rafraîchissement..." : "Rafraîchir"}
      </Button>
    </div>
  );
}
