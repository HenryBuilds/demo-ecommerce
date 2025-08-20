'use client'

import { useAuth } from './useAuth'

export function useAdminAuth() {
  const { user, loading } = useAuth()

  return {
    isAdmin: user?.role === 'ADMIN',
    loading,
    user
  }
}