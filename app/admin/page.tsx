import { AdminGuard } from "@/components/AdminGuard";

export default function AdminPage() {
  return (
    <AdminGuard>
      <div>Admin Dashboard Content</div>
    </AdminGuard>
  );
}
