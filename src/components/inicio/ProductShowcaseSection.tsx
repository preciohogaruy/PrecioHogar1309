
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/products"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { ProductCardGrid } from "../productos/ProductCardGrid"

export async function ProductShowcaseSection() {
    const { products } = await getProducts({ limit: 4, sort: "rating-desc" })

    return (
        <section id="products" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="section-title">
                        Productos{" "}
                        <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                            Destacados
                        </span>
                    </h2>
                    <p className="section-subtitle">
                        Descubre una selección de nuestros productos más populares y mejor valorados por nuestros clientes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCardGrid key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/productos">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            Ver todos los productos
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
