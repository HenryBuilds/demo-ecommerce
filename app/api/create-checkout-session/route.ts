import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'

type CheckoutItem = {
  name: string
  price: number
  quantity: number
  imageUrl: string | null
}

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CheckoutItem[] } = await request.json()
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: CheckoutItem) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : [],
          },
          unit_amount: Math.round(Number(item.price) * 100), // Cent conversion
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/cart`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 })
  }
}