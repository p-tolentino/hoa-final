'use client'

import { Box, Text, Flex, Spinner } from '@chakra-ui/react'

interface dashboardPoll {
  businessCount: number
  primarySelection: string
}

export default function BusinessCard ({
  businessCount,
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
              ? 'Total Business Posts'
              : 'Newly Posted Business Posts'}
          </Text>
          {businessCount ? (
            <Text fontSize='2xl' fontWeight='bold'>
              {businessCount}
            </Text>
          ) : (
            <Spinner mt={2} />
          )}
        </Box>
      </Flex>
    </Box>
  )
}
