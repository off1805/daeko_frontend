import { type RouteConfig, index, route } from "@react-router/dev/routes";
export default [
  index("routes/_index.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("ecole", "routes/ecole.tsx"),
  route("ddd-example", "routes/ddd-example.tsx"),
  route("eleves", "routes/eleves.tsx"),
  route("eleves/nouveau", "routes/eleves.nouveau.tsx"),
  route("eleves/import", "routes/eleves.import.tsx"),
  route("eleves/:id", "routes/eleves.$id.tsx"),
] satisfies RouteConfig;