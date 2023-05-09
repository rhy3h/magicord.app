import DashboardLayout from "./DashboardLayout";

export const Layouts = {
  Dashboard: DashboardLayout,
};

export type LayoutKeys = keyof typeof Layouts;
