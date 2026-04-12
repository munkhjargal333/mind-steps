import { DashboardLayout } from "@/shared/components/DashboardLayout";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{
    <DashboardLayout>
      {children}
    </DashboardLayout>}</>;
}
