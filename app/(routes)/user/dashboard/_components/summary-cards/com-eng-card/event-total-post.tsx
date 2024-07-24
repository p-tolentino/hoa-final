'use client'

import { Box, Text, Flex, Spinner } from '@chakra-ui/react'

interface dashboardPoll {
  eventCount: number
  primarySelection: string
}

export default function EventCard ({
  eventCount,
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
              ? 'Total Events Posted'
              : 'Newly Posted Events'}
          </Text>
          {eventCount ? (
            <Text fontSize='2xl' fontWeight='bold'>
              {eventCount}
            </Text>
          ) : (
            <Spinner mt={2} />
          )}
        </Box>
      </Flex>
    </Box>
  )
}
