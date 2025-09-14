
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
import dynamic from "next/dynamic"
import { CircularProgress } from "@mui/material"

const DynamicHeavyMap = dynamic(() => import("@/components/HeavyMap"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <CircularProgress />
    </div>
  ),
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CtaSection />
        <DynamicHeavyMap />
        <ProductShowcaseSection />
        <CategoriesSection />
        {/* <FinalCtaSection /> */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
