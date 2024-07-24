'use client'

import { Box, Text, Flex, Spinner } from '@chakra-ui/react'

interface dashboardPoll {
  discussCount: number
  primarySelection: string
}

export default function DisccusionCard ({
  discussCount,
  primarySelection
}: dashboardPoll) {
  return (
    <Box>
      <Flex
        alignItems='flex-start'
        direction='row'
        justifyContent='space-between'
        h='100px'
      >
        <Box>
          <Text
            color='gray.500'
            textTransform='uppercase'
            fontSize={primarySelection === 'all' ? 'xs' : '2xs'}
          >
            {primarySelection == 'all'
              ? 'Total Discussion Posts'
              : 'Newly Posted Discussion Posts'}
          </Text>
          {discussCount ? (
            <Text fontSize='2xl' fontWeight='bold'>
              {discussCount}
            </Text>
          ) : (
            <Spinner mt={2} />
          )}
        </Box>
      </Flex>
    </Box>
  )
}
