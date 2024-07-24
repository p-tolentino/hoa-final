'use client'

import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { Box, Text, Flex, Avatar, Spinner } from '@chakra-ui/react'
import { BsNewspaper } from 'react-icons/bs'

interface dashboardPoll {
  activeUsers: number
  requiredVotes: number
  voterTurnout: number
}

interface electionCardProps {
  electionInfo: dashboardPoll
  primarySelection: string
}

export default function ElectionCard ({
  electionInfo,
  primarySelection
}: electionCardProps) {
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
            {primarySelection == 'all'
              ? 'Voter Turnout of Latest Election'
              : 'Voter Turnout'}
          </Text>
          {electionInfo.voterTurnout && electionInfo.requiredVotes ? (
            <Text fontSize='2xl' fontWeight='bold'>
              {electionInfo.voterTurnout < electionInfo.requiredVotes ? (
                <TriangleDownIcon />
              ) : (
                <TriangleUpIcon />
              )}{' '}
              {(
                (electionInfo.voterTurnout / electionInfo.activeUsers) *
                100
              ).toFixed(2)}
              %
            </Text>
          ) : (
            <Spinner mt={2} />
          )}
        </Box>
        <Avatar
          bg='#7CA689'
          size='md'
          icon={<BsNewspaper size={24} color='white' />}
        />
      </Flex>
    </Box>
  )
}
