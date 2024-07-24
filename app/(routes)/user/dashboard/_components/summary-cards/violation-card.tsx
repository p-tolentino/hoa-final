'use client'

import { Box, Text, Flex, Avatar, Spinner } from '@chakra-ui/react'
import { PiBinocularsBold } from 'react-icons/pi'
import { TbMessageReport } from 'react-icons/tb'

interface dashboardPoll {
  count: number
  primarySelection: string
}

export default function ViolationCard ({
  count,
  primarySelection
}: dashboardPoll) {
  return (
    <Box>
      <Flex
        alignItems='flex-start'
        direction='row'
        justifyContent='space-between'
        p={4}
        borderRadius='md'
        boxShadow='md'
        bg='white'
        h='100px'
        minW='200px'
      >
        <Box>
          <Text color='gray.500' textTransform='uppercase' fontSize='2xs'>
            Total Resolved Violation Reports
          </Text>
          {count ? (
            <Text fontSize='2xl' fontWeight='bold'>
              {count}
            </Text>
          ) : (
            <Spinner mt={2} />
          )}
        </Box>
        <Avatar
          bg='#7CA689'
          size='md'
          icon={<PiBinocularsBold size={24} color='white' />}
        />
      </Flex>
    </Box>
  )
}
