import type { UserDTO } from "~/modules/user/application/dto/user.dto";

export function UserCard({ user }: { user: UserDTO }) {
  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <p className="text-xs text-muted-foreground">User #{user.id}</p>
      <p className="text-lg font-semibold">{user.name}</p>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </div>
  );
}
