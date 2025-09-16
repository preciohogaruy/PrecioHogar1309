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
  const where: any = {}

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

  const orderBy: any = {}
  if (sort) {
    const [field, direction] = sort.split("-")
    if (field && direction) {
      orderBy[field] = direction
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
