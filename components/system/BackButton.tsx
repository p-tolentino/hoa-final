'use client'

import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

const BackButton = () => {
  // Get the router object using useRouter
  const router = useRouter()

  // Function to handle the go back action
  const handleGoBack = () => {
    router.back() // This will navigate back to the previous page
  }

  return (
    <Button onClick={handleGoBack} size='sm'>
      Back
    </Button>
  )
}

export default BackButton
