'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Edit, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { AdminProductsData } from '@/types/types'
import { AdminGuard } from '@/components/AdminGuard'

export default function AdminProductsPage() {
  const [data, setData] = useState<AdminProductsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const router = useRouter()

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/products?${params}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [statusFilter, searchTerm])

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Delete "${productName}"?`)) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      toast.success('Product deleted')
      fetchProducts()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800'
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          <Button onClick={() => router.push('/admin/products/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Products ({data?.products.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.products.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <Button onClick={() => router.push('/admin/products/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {data?.products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">€{Number(product.price).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(product.status) + ' text-xs'}>
                            {product.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {product._count.orderItems} sales
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={product._count.orderItems > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  )
}