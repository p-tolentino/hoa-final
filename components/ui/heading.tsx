'use client'

import { Separator } from '@/components/ui/separator'
import { ButtonGroup, Flex, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface HeadingProps {
  title: string
  description: string
  leftElements?: React.ReactNode
  rightElements?: React.ReactNode
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  leftElements,
  rightElements
}) => {
  // For responsiveness when window is resized
  const [sidebarSize, changeSidebarSize] = useState('large')

  useEffect(() => {
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768 // You can adjust the breakpoint (768) as needed
      changeSidebarSize(isSmallScreen ? 'small' : 'large')
    }
    // Initial check on mount
    handleResize()
    // Event listener for window resize
    window.addEventListener('resize', handleResize)
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      {sidebarSize === 'large' ? (
        <Flex justifyContent='space-between' gap={10}>
          <Flex gap={5}>
            <Stack spacing={0.5} lineHeight={1.2}>
              {/* Page Title */}
              <Text
                fontSize={{ sm: '2xl', lg: '3xl' }}
                fontWeight='bold'
                fontFamily='font.heading'
              >
                {title}
              </Text>
              {/* Page Description */}
              <Text
                fontSize={{ sm: 'sm', lg: 'md' }}
                color='grey'
                fontFamily='font.body'
              >
                {description}
              </Text>
            </Stack>
            {/* Left Button */}
            {leftElements}
          </Flex>
          {/* Right Button */}
          {rightElements}
        </Flex>
      ) : (
        <Stack spacing={5}>
          <Stack spacing={0.5} lineHeight={1.2}>
            {/* Page Title */}
            <Text
              fontSize={{ sm: '2xl', lg: '3xl' }}
              fontWeight='bold'
              fontFamily='font.heading'
            >
              {title}
            </Text>
            {/* Page Description */}
            <Text
              fontSize={{ sm: 'sm', lg: 'md' }}
              color='grey'
              fontFamily='font.body'
            >
              {description}
            </Text>
          </Stack>
          {/* Left and Right Buttons */}
          <ButtonGroup>
            {leftElements}
            {rightElements}
          </ButtonGroup>
        </Stack>
      )}

      <Separator className='mt-4 mb-6' />
    </div>
  )
}
