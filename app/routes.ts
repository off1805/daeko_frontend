import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboardsudo", "routes/dashboardsudo.tsx"),
] satisfies RouteConfig;
