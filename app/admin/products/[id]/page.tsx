'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AdminGuard } from '@/components/AdminGuard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types/types'

type FormData = {
  name: string
  description: string
  price: string
  imageUrl: string
  downloadUrl: string
  category: string
  tags: string[]
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export default function AdminProductEditPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    downloadUrl: '',
    category: '',
    tags: [],
    status: 'DRAFT'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/admin/products')
          toast.error('Product not found')
          return
        }
        throw new Error('Failed to fetch product')
      }
      
      const result = await response.json()
      const productData = result.product
      
      setProduct(productData)
      setFormData({
        name: productData.name,
        description: productData.description || '',
        price: productData.price.toString(),
        imageUrl: productData.imageUrl || '',
        downloadUrl: productData.downloadUrl || '',
        category: productData.category || '',
        tags: productData.tags || [],
        status: productData.status
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
      router.push('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      toast.success('Product updated successfully')
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Error updating product:', error)
      toast.error(error.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/admin/products')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Edit Product
                </h1>
                <p className="text-muted-foreground">
                  {product?.name}
                </p>
              </div>
            </div>
            {product && (
              <Button 
                variant="outline"
                onClick={() => router.push(`/products/${product.slug}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="shadow-lg border-0 bg-background/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (€) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      className={errors.price ? 'border-destructive' : ''}
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => 
                        handleInputChange('status', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g. Software, E-Books"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <img 
                        src={formData.imageUrl} 
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="downloadUrl">Download URL</Label>
                  <Input
                    id="downloadUrl"
                    value={formData.downloadUrl}
                    onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                    placeholder="https://example.com/download.zip"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                        placeholder="Enter tag and press Enter"
                      />
                      <Button type="button" onClick={addTag} variant="outline" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X 
                              className="w-3 h-3 cursor-pointer hover:text-destructive" 
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/admin/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminGuard>
  )
}