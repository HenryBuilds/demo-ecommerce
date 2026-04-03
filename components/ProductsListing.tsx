"use client";

import ProductsGrid from "@/components/ProductGrid";
import { PaginationData, Product } from "@/types/types";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SlidersHorizontal } from "lucide-react";

type Props = {
  initialProducts: Product[];
  initialPagination: PaginationData;
  allCategories: string[];
};

export default function ProductsListing({ initialProducts, initialPagination, allCategories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>(initialPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [category, setCategory] = useState<string>("all");
  const [isInitial, setIsInitial] = useState(true);

  const fetchProducts = useCallback(async (page: number, limit: number, cat: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: "published",
        page: page.toString(),
        limit: limit.toString(),
      });
      if (cat !== "all") params.append("category", cat);

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) {
        const errorData = await response.text();
        console.error("API error:", response.status, errorData);
        throw new Error("Failed to fetch products");
      }

      const result = await response.json();
      setProducts(result.products);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }
    fetchProducts(currentPage, itemsPerPage, category);
  }, [currentPage, itemsPerPage, category, fetchProducts, isInitial]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    const buttons = [];
    const { currentPage: current, totalPages } = pagination;

    buttons.push(
      <Button key="first" variant="ghost" size="icon" onClick={() => handlePageChange(1)} disabled={current === 1} className="hidden sm:flex h-9 w-9">
        <ChevronsLeft className="h-4 w-4" />
      </Button>
    );
    buttons.push(
      <Button key="prev" variant="ghost" size="icon" onClick={() => handlePageChange(current - 1)} disabled={!pagination.hasPrevPage} className="h-9 w-9">
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    const startPage = Math.max(1, current - 2);
    const endPage = Math.min(totalPages, current + 2);

    if (startPage > 1) {
      buttons.push(
        <Button key={1} variant={current === 1 ? "default" : "ghost"} size="icon" onClick={() => handlePageChange(1)} className="hidden sm:flex h-9 w-9 text-sm">1</Button>
      );
      if (startPage > 2) buttons.push(<span key="dots1" className="px-1 text-muted-foreground hidden sm:inline">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button key={i} variant={current === i ? "default" : "ghost"} size="icon" onClick={() => handlePageChange(i)} className="h-9 w-9 text-sm">{i}</Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) buttons.push(<span key="dots2" className="px-1 text-muted-foreground hidden sm:inline">...</span>);
      buttons.push(
        <Button key={totalPages} variant={current === totalPages ? "default" : "ghost"} size="icon" onClick={() => handlePageChange(totalPages)} className="hidden sm:flex h-9 w-9 text-sm">{totalPages}</Button>
      );
    }

    buttons.push(
      <Button key="next" variant="ghost" size="icon" onClick={() => handlePageChange(current + 1)} disabled={!pagination.hasNextPage} className="h-9 w-9">
        <ChevronRight className="h-4 w-4" />
      </Button>
    );
    buttons.push(
      <Button key="last" variant="ghost" size="icon" onClick={() => handlePageChange(totalPages)} disabled={current === totalPages} className="hidden sm:flex h-9 w-9">
        <ChevronsRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">Products</h1>
          <p className="text-muted-foreground">
            {pagination.totalCount} digital products available
          </p>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          {allCategories.filter(Boolean).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Items per page */}
          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-20 h-9 text-sm">
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

        {/* Product grid */}
        <ProductsGrid products={products} loading={loading} />

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-0.5">
              {renderPaginationButtons()}
            </div>
            <p className="text-xs text-muted-foreground">
              {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}–{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of {pagination.totalCount}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
