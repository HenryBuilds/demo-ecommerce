"use client";

import ProductsGrid from "@/components/ProductGrid";
import { PaginationData, Product } from "@/types/types";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function ProductsListing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [category, setCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = useCallback(async (page: number = 1, limit: number = 12, cat: string = "all") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "published",
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (cat !== "all") {
        params.append("category", cat);
      }

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const result = await response.json();
      setProducts(result.products);
      setPagination(result.pagination);
      
      const uniqueCategories = Array.from(
        new Set(result.products.map((p: Product) => p.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage, category);
  }, [currentPage, itemsPerPage, category, fetchProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); 
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1); 
  };

  const renderPaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const buttons = [];
    const { currentPage: current, totalPages } = pagination;
    
    buttons.push(
      <Button
        key="first"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(1)}
        disabled={current === 1}
        className="hidden sm:flex"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
    );

    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(current - 1)}
        disabled={!pagination.hasPrevPage}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    const startPage = Math.max(1, current - 2);
    const endPage = Math.min(totalPages, current + 2);

    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={current === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="hidden sm:flex"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="px-2 text-muted-foreground hidden sm:inline">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={current === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="px-2 text-muted-foreground hidden sm:inline">
            ...
          </span>
        );
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={current === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="hidden sm:flex"
        >
          {totalPages}
        </Button>
      );
    }

    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(current + 1)}
        disabled={!pagination.hasNextPage}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    buttons.push(
      <Button
        key="last"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(totalPages)}
        disabled={current === totalPages}
        className="hidden sm:flex"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Template Shop Products
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purchase our digital products and receive instant access via a
            secure download link.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category:
              </label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm font-medium">
                Show:
              </label>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {pagination && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {pagination.totalCount} Products
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Page {pagination.currentPage} of {pagination.totalPages}
              </Badge>
            </div>
          )}
        </div>

        <ProductsGrid products={products} loading={loading} />

        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {renderPaginationButtons()}
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of{" "}
              {pagination.totalCount} products
            </div>
          </div>
        )}
      </div>
    </div>
  );
}