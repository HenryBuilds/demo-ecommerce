'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, ArrowLeft, Star, Package, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types/types'

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/slug/${slug}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/products')
          toast.error('Product not found')
          return
        }
        throw new Error('Failed to fetch product')
      }
      
      const result = await response.json()
      setProduct(result.product)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return
    
    setAddingToCart(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success(`${product.name} added to cart`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    
    try {
      toast.info('Redirecting to checkout...')
    } catch (error) {
      console.error('Error buying now:', error)
      toast.error('Failed to process purchase')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto py-16 px-4 text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or is not available.
          </p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/products')}
            className="p-0 h-auto hover:text-primary"
          >
            Products
          </Button>
          <span>/</span>
          {product.category && (
            <>
              <span>{product.category}</span>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            <Card className="overflow-hidden border-0 shadow-lg bg-background/80 backdrop-blur">
              <CardContent className="p-0">
                {product.imageUrl ? (
                  <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                    <Package className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.category && (
                  <Badge variant="secondary">
                    {product.category}
                  </Badge>
                )}
                {product.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-primary">
                  €{Number(product.price).toFixed(2)}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < 4 ? 'fill-white text-white' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.8) • 127 reviews</span>
                </div>
              </div>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <div className="text-muted-foreground leading-relaxed">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
                  <select 
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded px-3 py-1 bg-background"
                  >
                    {[1,2,3,4,5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  size="lg" 
                  onClick={handleBuyNow}
                  className="w-full"
                >
                  Buy Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full"
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>

              {product.downloadUrl && (
                <div className="flex items-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Digital product - Instant download after purchase
                </div>
              )}
            </div>

            <Card className="bg-background/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{product.downloadUrl ? 'Digital Product' : 'Physical Product'}</span>
                  </div>
                  {product.category && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{product.category}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className="text-green-600">In Stock</span>
                  </div>
                  {product.downloadUrl && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Download:</span>
                      <span>Available immediately</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}