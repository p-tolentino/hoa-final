'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '@fontsource-variable/cabin'
import '@fontsource-variable/montserrat'

// Theme
const colors = {
  brand: {
    500: '#355E3B', // Green
    400: '#EFF2F3', // White
    300: '#F0CB5B' // Yellow
  }
}
const fonts = {
  font: {
    heading: 'montserrat variable',
    body: 'cabin variable'
  }
}
const theme = extendTheme({ colors, fonts })

export function Providers ({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}
