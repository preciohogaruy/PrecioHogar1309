"use client"

import type React from "react"
import { useState } from "react"
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material"
import { Home, Search, Favorite } from "@mui/icons-material"

export function BottomNavBar() {
  const [value, setValue] = useState(0)

  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
      >
        <BottomNavigationAction label="Inicio" icon={<Home />} />
        <BottomNavigationAction label="Buscar" icon={<Search />} />
        <BottomNavigationAction label="Favoritos" icon={<Favorite />} />
      </BottomNavigation>
    </Box>
  )
}
