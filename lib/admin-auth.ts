import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { AdminUser } from '@/types/types'
import prisma from './prisma'

export async function getAdminUser(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    if (decoded.role !== 'ADMIN') {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    if (!user || user.role !== 'ADMIN') {
      return null
    }

    return user as AdminUser
  } catch (error) {
    return null
  }
}

export function requireAdminApi(handler: (req: NextRequest, admin: AdminUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const admin = await getAdminUser(request)

    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return handler(request, admin)
  }
}