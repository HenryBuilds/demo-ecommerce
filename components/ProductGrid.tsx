'use client'

import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from './ProductCard'
import { Product } from '@/types/types'

type ProductsGridProps = {
  products: Product[]
  loading: boolean
}

export default function ProductsGrid({ products, loading }: ProductsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-fade-in rounded-2xl overflow-hidden border border-border bg-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="aspect-[4/3] bg-secondary animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-secondary rounded-lg w-3/4 animate-pulse" />
              <div className="h-3 bg-secondary rounded-lg w-full animate-pulse" />
              <div className="h-3 bg-secondary rounded-lg w-1/2 animate-pulse" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-secondary rounded-lg w-16 animate-pulse" />
                <div className="h-8 bg-secondary rounded-full w-16 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1">No products found</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Try a different category or check back later.
        </p>
        <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
