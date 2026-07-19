import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("ddd-example", "routes/ddd-example.tsx"),
] satisfies RouteConfig;
