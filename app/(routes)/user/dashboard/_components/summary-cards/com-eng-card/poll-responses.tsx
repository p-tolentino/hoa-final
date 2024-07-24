'use client'

import { Box, Text, Flex, Spinner } from '@chakra-ui/react'

interface dashboardPoll {
  userPollCount: number
  primarySelection: string
}

export default function PollCard ({
  userPollCount,
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
              ? 'Total Homeowners who answered a Poll'
              : 'Homeowners who answered a Poll'}
          </Text>
          {userPollCount ? (
            <Text fontSize='2xl' fontWeight='bold'>
              {userPollCount}
            </Text>
          ) : (
            <Spinner mt={2} />
          )}
        </Box>
      </Flex>
    </Box>
  )
}
