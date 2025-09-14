
import { PrismaClient } from '@prisma/client';
import productsData from './data/products.json';
import categoriesData from './data/categorys.json';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Cargar categorías
  console.log('Seeding categories...');
  for (const category of categoriesData.categorys) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        description: category.description,
      },
      create: {
        id: category.id,
        name: category.name,
        description: category.description,
      },
    });
  }
  console.log('Categories seeded.');

  // Cargar productos
  console.log('Seeding products...');
  for (const product of productsData.products) {
    await prisma.product.upsert({
      where: { productId: product.productId },
      update: {
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
        rating: product.rating,
        badge: product.badge,
        categoryId: product.categoryId,
      },
      create: {
        productId: product.productId,
        title: product.title,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        image: product.image,
        rating: product.rating,
        badge: product.badge,
        categoryId: product.categoryId,
      },
    });
  }
  console.log('Products seeded.');

  console.log(`Seeding finished.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
