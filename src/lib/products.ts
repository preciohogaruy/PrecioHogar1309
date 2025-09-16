
import { Prisma } from "@prisma/client";
import prisma from "./prisma"

export async function getProducts({
  page = 1,
  limit = 12,
  category,
  search,
  sort,
}: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
} = {}) {
  const where: Prisma.ProductWhereInput = {}

  if (category && category !== "Todos") {
    where.category = {
      name: category,
    }
  }

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    }
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {}
  if (sort) {
    const [field, direction] = sort.split("-")
    if (field && direction) {
      orderBy[field as keyof Prisma.ProductOrderByWithRelationInput] = direction as Prisma.SortOrder
    }
  } else {
    orderBy.createdAt = "desc"
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  }
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: {
      title: {
        equals: slug.replace(/-/g, " "),
        mode: "insensitive",
      },
    },
    include: {
      category: true,
    },
  })
  return product
}
