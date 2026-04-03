"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Star, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/CartContext";
import { Product } from "@/types/types";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        slug: product.slug,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const staggerClass = index < 12 ? `stagger-${index + 1}` : "";

  return (
    <div className={`animate-fade-in-up ${staggerClass} group`}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
            )}

            {/* Category pill */}
            {product.category && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {product.category}
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-background text-foreground text-sm font-medium shadow-lg">
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-[15px] leading-snug line-clamp-1 text-card-foreground group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < 4 ? "fill-primary text-primary" : "fill-secondary text-secondary"}`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">4.8</span>
            </div>

            {/* Price + cart */}
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold tracking-tight text-card-foreground">
                €{Number(product.price).toFixed(2)}
              </span>

              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="h-8 px-3 rounded-full text-xs gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                {addingToCart ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-[1.5px] border-current border-t-transparent" />
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
