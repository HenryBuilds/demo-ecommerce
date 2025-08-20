"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Star } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/CartContext";
import { Product } from "@/types/types";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [addingToCart, setAddingToCart] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
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

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background/80 backdrop-blur">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}

          {product.category && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 bg-background/90 text-foreground backdrop-blur-sm border text-xs"
            >
              {product.category}
            </Badge>
          )}

          <Link href={`/products/${product.slug}`}>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                className="backdrop-blur-sm"
              >
                Quick View
              </Button>
            </div>
          </Link>
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <div className="mb-2 flex-grow">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-base leading-tight hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            <div className="h-4 mt-1">
              {product.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {product.description}
                </p>
              )}
            </div>
          </div>

          <div className="h-6 mb-2">
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs py-0 px-1 h-5"
                  >
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs py-0 px-1 h-5">
                    +{product.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-lg font-bold text-primary">
                €{Number(product.price).toFixed(2)}
              </span>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < 4
                        ? "fill-white text-white"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  (4.8)
                </span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="text-xs px-3 py-1 h-8"
            >
              {addingToCart ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              ) : (
                <>
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
