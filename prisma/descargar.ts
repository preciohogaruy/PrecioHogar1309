import { Prisma, PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const outputDir = path.join(__dirname, 'data');

async function main() {
  console.log('Iniciando la descarga de datos desde la base de datos...');

  // Asegurarse de que el directorio de salida exista
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Obtener todos los nombres de los modelos del esquema de Prisma
  const modelNames = Prisma.dmmf.datamodel.models.map(model => model.name);

  for (const modelName of modelNames) {
    // Prisma Client usa nombres de modelo en minúscula (camelCase)
    const prismaModelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    
    // @ts-expect-error - Usamos un acceso dinámico al modelo que TypeScript no puede verificar estáticamente
    const data = await prisma[prismaModelName].findMany();

    const fileName = `${modelName.toLowerCase()}s.json`;
    const filePath = path.join(outputDir, fileName);

    // Formatear la salida para que coincida con la estructura de productos.json
    const outputData = {
        [modelName.toLowerCase() + 's']: data
    }

    fs.writeFileSync(filePath, JSON.stringify(outputData, null, 2));
    console.log(`Datos del modelo "${modelName}" guardados en ${filePath}`);
  }

  console.log('¡Descarga de datos completada!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
