import prisma from "@/lib/prisma";
import ProductsListing from "@/components/ProductsListing";
import { PaginationData } from "@/types/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const itemsPerPage = 12;

  const [products, totalCount, categoriesRaw] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: itemsPerPage,
      skip: 0,
    }),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const pagination: PaginationData = {
    currentPage: 1,
    totalPages,
    itemsPerPage,
    totalCount,
    hasNextPage: 1 < totalPages,
    hasPrevPage: false,
    nextPage: 1 < totalPages ? 2 : null,
    prevPage: null,
  };

  const allCategories = categoriesRaw
    .map((c) => c.category)
    .filter((c): c is string => c !== null && c !== "");

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <ProductsListing
      initialProducts={serializedProducts}
      initialPagination={pagination}
      allCategories={allCategories}
    />
  );
}
