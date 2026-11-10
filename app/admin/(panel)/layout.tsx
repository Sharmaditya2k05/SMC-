import { AdminShell } from "@/components/admin/kit";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
