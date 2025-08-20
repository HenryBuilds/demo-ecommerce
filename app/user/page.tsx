import { UserGuard } from '@/components/UserGuard'

export default function DashboardPage() {
  return (
    <UserGuard>
      <div>Protected Dashboard Content</div>
    </UserGuard>
  )
}