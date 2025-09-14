
"use client"

import { Navbar } from "@/components/layout/Navbar"
import { ProductView } from "@/components/productos/ProductView"
import { Footer } from "@/components/layout/Footer"
import Fab from "@mui/material/Fab"
import AddIcon from "@mui/icons-material/Add"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <ProductView />
      </main>
      <Footer />
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  )
}
