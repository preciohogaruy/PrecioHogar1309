
"use client"

import { Navbar } from "@/components/layout/Navbar"
import { HeroSection } from "@/components/inicio/HeroSection"
import { FeaturesSection } from "@/components/inicio/FeaturesSection"
import { CtaSection } from "@/components/inicio/CtaSection"
import { ProductShowcaseSection } from "@/components/inicio/ProductShowcaseSection"
import { CategoriesSection } from "@/components/inicio/CategoriesSection"
// import { FinalCtaSection } from "@/components/inicio/FinalCtaSection"
import { NewsletterSection } from "@/components/inicio/NewsletterSection"
import { Footer } from "@/components/layout/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
        <ProductShowcaseSection />
        <CategoriesSection />
        {/* <FinalCtaSection /> */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
