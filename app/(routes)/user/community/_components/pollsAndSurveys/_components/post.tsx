'use client'

import {
  Flex,
  Box,
  Text,
  Stack,
  Heading,
  Avatar,
  HStack,
  Spacer,
  Spinner
} from '@chakra-ui/react'
import Answer from './_answer&report/answer'
import Report from './_answer&report/report'
import { format, formatDistanceToNowStrict } from 'date-fns'
import { updateStatus } from '@/server/actions/poll'

import { Polls, Hoa } from '@prisma/client'

import React, { useEffect } from 'react'

interface PollProps {
  polls: Polls[]
  user: string
  userInfos: UserInfos
  hoaInfo: Hoa
}

interface UserInfo {
  lastName: string | null
  firstName: string | null
  position: string | null
}

interface UserInfos {
  [userId: string]: UserInfo | null
}

const Post: React.FC<PollProps> = ({ polls, user, userInfos, hoaInfo }) => {
  const categoryColors = {
    MEETING: 'purple.200',
    ELECTION: 'pink.200',
    INQUIRY: 'blue.200',
    EVENT: 'orange.200',
    FOODANDDRINK: 'purple.200',
    CLOTHING: 'pink.200',
    HOUSEHOLDITEMS: 'blue.200',
    HOMESERVICES: 'orange.200',
    OTHER: 'teal.200'
  }

  useEffect(() => {
    polls.forEach(async poll => {
      const startDate = new Date(poll.startDate)
      const endDate = new Date(poll.endDate)
      const now = new Date()

      let newStatus: 'ACTIVE' | 'INACTIVE' = 'INACTIVE'
      if (now >= startDate && now <= endDate) {
        newStatus = 'ACTIVE'
      }

      if (poll.status !== newStatus) {
        await updateStatus(poll.id, newStatus)
        // Optionally: Set state here to re-render the component or refetch the polls to reflect the update.
        // This will depend on how you manage state in your component.
      }
    })
  }, [polls])

  return (
    <>
      {polls.map(poll => (
        <Flex p='10px' key={poll.id}>
          <Box
            w='100%'
            h='100%'
            border='1px'
            borderColor={poll.status === 'ACTIVE' ? 'green.300' : 'red.300'}
            borderRadius='10px'
            mb='1%'
          >
            {/* Survey Status */}
            <Box
              fontSize='xs'
              ml='3px'
              w='99%'
              px={2}
              textAlign='center'
              fontWeight='bold'
              bgColor={poll.status == 'ACTIVE' ? 'green.200' : 'red.200'}
              borderRadius='8px'
              mt={1}
            >
              {/* {poll.status} */}
              {poll.status === 'ACTIVE'
                ? 'ACTIVE'
                : new Date() < new Date(poll.startDate)
                ? 'INACTIVE (Incoming Poll)'
                : new Date() > new Date(poll.endDate)
                ? 'INACTIVE (Voting Period is Over)'
                : 'INACTIVE'}
            </Box>
            <Box p='20px'>
              <HStack mb='0.5rem'>
                <Stack spacing={0}>
                  {/* Survey Title */}
                  <Heading size='sm' fontFamily='font.heading' mb='1%'>
                    {poll.title}
                  </Heading>
                  {/* Survey Duration */}
                  <Text fontSize='xs'>
                    Duration:{' '}
                    {poll.startDate
                      ? format(new Date(poll.startDate), 'MMMM dd, yyyy')
                      : 'Start date not set'}{' '}
                    to{' '}
                    {poll.endDate
                      ? format(new Date(poll.endDate), 'MMMM dd, yyyy')
                      : 'End date not set'}
                  </Text>
                </Stack>
                <Spacer />
                {/* Survey Button */}
                {poll.status == 'ACTIVE' ? (
                  <HStack>
                    <Answer poll={poll} user={user} />
                  </HStack>
                ) : new Date() > new Date(poll.startDate) &&
                  new Date() > new Date(poll.endDate) ? (
                  <Report poll={poll} user={user} hoaInfo={hoaInfo} />
                ) : null}
              </HStack>

              {/* Survey Categories */}
              <HStack mb='2%'>
                <Box
                  bg={categoryColors[poll.category]}
                  fontFamily='font.heading'
                  fontSize='xs'
                  fontWeight='semibold'
                  w='wrap'
                  p='3px'
                  pr='8px'
                  pl='8px'
                  textAlign='center'
                  rounded='md'
                >
                  {poll.category}
                </Box>
              </HStack>

              {/* Survey Details */}
              <Flex gap='0.5rem'>
                <Avatar /> {/*default size is medium*/}
                <Box>
                  {userInfos[poll.userId]?.firstName &&
                  userInfos[poll.userId]?.lastName ? (
                    <Text
                      id='name'
                      fontSize='sm'
                      fontWeight='bold'
                      fontFamily='font.body'
                    >
                      {userInfos[poll.userId]?.firstName}{' '}
                      {userInfos[poll.userId]?.lastName}
                    </Text>
                  ) : (
                    <>
                      <span className='text-gray-400 text-xs'>
                        Please wait...{'  '}
                      </span>
                      <Spinner size='xs' thickness='1px' />
                      <br />
                    </>
                  )}

                  {userInfos[poll.userId]?.position ? (
                    <Text
                      id='position'
                      fontSize='sm'
                      fontWeight='bold'
                      fontFamily='font.body'
                    >
                      {userInfos[poll.userId]?.position}
                    </Text>
                  ) : (
                    <>
                      <span className='text-gray-400 text-xs'>
                        Please wait...{'  '}
                      </span>
                      <Spinner size='xs' thickness='1px' />
                      <br />
                    </>
                  )}

                  <Text
                    id='description'
                    fontSize='sm'
                    py='10px'
                    fontFamily='font.body'
                    textAlign='justify'
                  >
                    {poll.description}
                  </Text>
                  {/* Date distance */}
                  <Text
                    fontFamily='font.body'
                    color='grey'
                    fontSize='xs'
                    textAlign='justify'
                  >
                    Posted {formatDistanceToNowStrict(new Date(poll.createdAt))}{' '}
                    ago
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Flex>
      ))}
    </>
  )
}
export default Post
