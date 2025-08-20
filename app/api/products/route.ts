import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminUser } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')
    const offset = searchParams.get('offset')

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    } else {
      where.status = 'PUBLISHED'
    }
    
    if (category) {
      where.category = category
    }

    const itemsPerPage = limit ? parseInt(limit) : 10
    const currentPage = page ? parseInt(page) : 1
    const skip = offset ? parseInt(offset) : (currentPage - 1) * itemsPerPage

    if (itemsPerPage < 1 || itemsPerPage > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      )
    }

    if (currentPage < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      )
    }

    const totalCount = await prisma.product.count({ where })

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: itemsPerPage,
      skip
    })

    const totalPages = Math.ceil(totalCount / itemsPerPage)
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

    const pagination = {
      currentPage,
      totalPages,
      itemsPerPage,
      totalCount,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? currentPage + 1 : null,
      prevPage: hasPrevPage ? currentPage - 1 : null
    }

    return NextResponse.json({ 
      products, 
      pagination 
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser(request)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { name, description, price, imageUrl, downloadUrl, category, tags, status } = await request.json()

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }

    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this name already exists' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        downloadUrl,
        slug,
        category,
        tags: tags || [],
        status: status || 'DRAFT'
      }
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}