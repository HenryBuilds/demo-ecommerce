import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminUser } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser(request)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    })

    const stats = await prisma.product.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    const totalRevenue = await prisma.orderItem.aggregate({
      _sum: { price: true },
      where: {
        order: {
          status: 'PAID'
        }
      }
    })

    return NextResponse.json({ 
      products,
      stats: stats.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status
        return acc
      }, {} as Record<string, number>),
      totalRevenue: totalRevenue._sum.price || 0
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch admin products' },
      { status: 500 }
    )
  }
}