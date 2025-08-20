import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    const existingOrder = await prisma.order.findFirst({
      where: { stripePaymentId: sessionId }
    })

    if (existingOrder) {
      return NextResponse.json({ order: existingOrder }, { status: 200 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ['data.price.product']
    })

    const order = await prisma.order.create({
      data: {
        status: 'PAID',
        totalAmount: session.amount_total! / 100,
        stripePaymentId: sessionId,
        customerEmail: session.customer_details?.email || 'unknown@example.com',
        customerName: session.customer_details?.name,
        orderItems: {
          create: await Promise.all(lineItems.data.map(async (item) => {
            const stripeProduct = item.price?.product as Stripe.Product
            const productName = stripeProduct?.name || 'Unknown Product'
            
            const product = await prisma.product.findFirst({
              where: { name: productName }
            })

            if (!product) {
              throw new Error(`Product not found: ${productName}`)
            }

            return {
              quantity: item.quantity || 1,
              price: (item.price?.unit_amount || 0) / 100,
              productId: product.id,
            }
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}