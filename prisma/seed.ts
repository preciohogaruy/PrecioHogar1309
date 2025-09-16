
import { PrismaClient } from '@prisma/client';
import categoriesData from './data/categorys.json';
import productsData from './data/products.json';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Cargar categorías
  console.log('Seeding categories...');
  for (const category of categoriesData.categorys) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        description: category.description,
        tag: category.tag,
      },
      create: {
        name: category.name,
        description: category.description,
        tag: category.tag,
      },
    });
  }
  console.log('Categories seeded.');

  const allCategories = await prisma.category.findMany();
  const categoryMap = new Map(allCategories.map(c => [c.id, c.name]));

  // Cargar productos
  console.log('Seeding products...');
  for (const product of productsData.products) {
    const existingProduct = await prisma.product.findUnique({
      where: { productId: product.productId },
    });

    if (!existingProduct) {
      // Verificar si la categoryId del producto existe en el mapa de categorías
      if (categoryMap.has(product.categoryId)) {
        await prisma.product.create({
          data: {
            productId: product.productId,
            title: product.title,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            rating: product.rating,
            badge: product.badge,
            categoryId: product.categoryId,
            image: product.image,
          },
        });
      } else {
        console.warn(`Category ID '${product.categoryId}' for product '${product.title}' not found. Skipping.`);
      }
    }
  }
  console.log('Products seeded.');

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

    