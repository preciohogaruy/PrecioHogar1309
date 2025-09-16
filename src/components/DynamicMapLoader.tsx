
"use client"

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

export function DynamicMapLoader() {
  return <DynamicHeavyMap />
}
