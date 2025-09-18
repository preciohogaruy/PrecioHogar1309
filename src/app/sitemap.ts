import { getProducts } from '@/lib/products';
import { MetadataRoute } from 'next';

const URL = 'https://preciohogaruy.netlify.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getProducts({ limit: 100 }); // Ajusta el límite según sea necesario

  const productEntries: MetadataRoute.Sitemap = products.map(({ title, updatedAt }) => {
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    return {
      url: `${URL}/productos/${slug}`,
      lastModified: updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  });

  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${URL}/productos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...productEntries,
    {
        url: `${URL}/registro`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.5,
    },
  ];
}
