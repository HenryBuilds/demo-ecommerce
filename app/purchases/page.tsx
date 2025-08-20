'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Package, ArrowLeft, Calendar, User } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { Order } from '@/types/types'


export default function MyPurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchPurchases()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/my-purchases')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login?redirect=/my-purchases')
          return
        }
        throw new Error('Failed to fetch purchases')
      }

      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching purchases:', error)
      toast.error('Failed to load purchases')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto py-16 px-4 text-center">
          <User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Please sign in to view your purchase history and download your products.
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/login?redirect=/my-purchases')} size="lg">
              Sign In
            </Button>
            <Button onClick={() => router.push('/')} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              My Purchases
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name || user.email}! Here are your purchases.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="shadow-lg bg-background/80 backdrop-blur border-0">
            <CardContent className="text-center py-12">
              <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any purchases yet. Start shopping to see your orders here!
              </p>
              <Button onClick={() => router.push('/')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Your Orders ({orders.length})</h2>
              <Badge variant="secondary" className="text-sm">
                Total spent: €{orders.reduce((sum, order) => sum + Number(order.totalAmount), 0).toFixed(2)}
              </Badge>
            </div>

            {orders.map((order) => (
              <Card key={order.id} className="shadow-lg bg-background/80 backdrop-blur border-0">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      €{Number(order.totalAmount).toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {item.product.imageUrl ? (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{item.product.name}</h4>
                            {item.product.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {item.product.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span>Quantity: {item.quantity}</span>
                              <span>Price: €{Number(item.price).toFixed(2)} each</span>
                            </div>
                          </div>
                        </div>
                        
                        {item.product.downloadUrl && (
                          <Button 
                            onClick={() => window.open(item.product.downloadUrl!, '_blank')}
                            className="ml-4"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}