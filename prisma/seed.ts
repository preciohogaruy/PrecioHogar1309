import { PrismaClient } from '@prisma/client';
import productsData from './data/productos.json';

const prisma = new PrismaClient();

const categories = [
  { name: 'Hogar', description: 'Todo lo que necesitas para tu casa.' },
  { name: 'Tecnologia', description: 'Lo último en tecnología y gadgets.' },
  { name: 'Cuidado Personal', description: 'Productos para tu bienestar y belleza.' },
  { name: 'Herramientas', description: 'Las mejores herramientas para tus proyectos.' },
  { name: 'Otros', description: 'Descubre una variedad de productos.' },
  { name: 'Cocina', description: 'Electrodomésticos, utensilios y accesorios.' },
  { name: 'Dormitorio', description: 'Ropa de cama, almohadas y decoración.' },
  { name: 'Baño', description: 'Accesorios, organización y productos.' },
];

async function main() {
  console.log(`Start seeding ...`);

  // Seed categories and get them back with their IDs
  const createdCategories = await Promise.all(
    categories.map(category =>
      prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: {
          name: category.name,
          description: category.description,
        },
      })
    )
  );

  const categoryMap = createdCategories.reduce((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {} as Record<string, number>);

  console.log('Seeded categories:', createdCategories.map(c => c.name).join(', '));


  // Seed products
  for (const product of productsData.products) {
    const categoryId = categoryMap[product.category];
    if (categoryId) {
      await prisma.product.upsert({
        where: { productId: product.id },
        update: {},
        create: {
          productId: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          image: product.image,
          rating: product.rating,
          badge: product.badge,
          categoryId: categoryId,
        },
      });
    } else {
        console.warn(`Category "${product.category}" for product "${product.title}" not found. Skipping.`);
    }
  }

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
