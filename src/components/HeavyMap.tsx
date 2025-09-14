
"use client"

import { Box, Typography } from "@mui/material"

export default function HeavyMap() {
  return (
    <Box
      sx={{
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        margin: "2rem 0",
        borderRadius: "1rem",
      }}
    >
      <Typography variant="h5">Este es un componente pesado (ej. Mapa Interactivo)</Typography>
    </Box>
  )
}
