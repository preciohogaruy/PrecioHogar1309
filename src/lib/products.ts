import prisma from './prisma'

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
  })
  return products
}

export async function getProductBySlug(slug: string) {
    const product = await prisma.product.findFirst({
        where: {
            title: {
                equals: slug.replace(/-/g, " "),
                mode: 'insensitive'
            }
        },
        include: {
            category: true
        }
    })
    return product;
}
