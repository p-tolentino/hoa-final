'use client'

import {
  Stack,
  Text,
  Box,
  Divider,
  Progress,
  Flex,
  Heading
} from '@chakra-ui/react'
import { Polls, Hoa } from '@prisma/client'
import { format } from 'date-fns'
import React from 'react'
import NextImage from 'next/image'
import SystemLogo from '@/public/HOAs.is-logo.png'

// Assuming PollDetails includes the `poll` object structure
interface PollProps {
  poll: Polls
  pollDetail: Question[] // Assuming questions are part of poll details
  hoaInfo: Hoa
}

interface Option {
  id: string
  text: string
  count: number
}

interface Question {
  id: string
  text: string
  options: Option[]
}

export default function PDFReport ({ poll, pollDetail, hoaInfo }: PollProps) {
  const reportTitle = poll.title
  const reportSubtitle = `Posted on ${format(
    new Date(poll.createdAt).toLocaleDateString(),
    'MMMM dd, yyyy'
  )}`

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Stack spacing={3}>
      {/* Report Header */}
      <Flex
        bg='brand.500'
        color='brand.400'
        h='70px'
        p={2}
        gap={3}
        className='report-header'
      >
        <NextImage
          src={SystemLogo}
          alt='HOAs.is Logo'
          width={100}
          height={70}
          className='m-2'
        />
        <Box m={2} lineHeight={1.1}>
          <Text fontSize='lg' fontFamily='font.heading' fontWeight='bold'>
            {hoaInfo?.name}
          </Text>
          <Flex gap={10}>
            <Flex fontFamily='font.body' gap={3}>
              <span>Contact Number: </span>
              {hoaInfo?.contactNumber}
            </Flex>
          </Flex>
        </Box>
      </Flex>

      <Box className='report-content' alignSelf='center'>
        {/* Report Title, Subtitle, and Date */}
        <Box mt={5}>
          <Heading fontSize='xl' textAlign='center' fontFamily='font.heading'>
            {reportTitle}
          </Heading>
          <Text
            fontSize='sm'
            textAlign='center'
            color='gray.600'
            fontFamily='font.body'
          >
            {reportSubtitle}
          </Text>
          <Text
            fontSize='xs'
            textAlign='center'
            color='gray.500'
            fontFamily='font.body'
            mt={1}
          >
            Date Generated: {currentDate}
          </Text>
        </Box>

        {/* Form Content */}
        <Stack spacing='15px' m={5}>
          <Text fontSize='sm' textAlign='justify'>
            <span className='font-semibold'>Description</span>:{' '}
            {poll.description}
          </Text>
          <Divider mt={2} />

          {/* Poll Result */}
          <Box>
            <Stack spacing='15px'>
              {pollDetail &&
                pollDetail.map((question, questionIndex) => (
                  <React.Fragment key={question.id}>
                    <Box lineHeight={1.5} className='page-break-auto'>
                      <Text fontSize='sm' fontWeight='semibold' mt={3}>
                        Question {questionIndex + 1}:
                      </Text>
                      <Text
                        fontSize='sm'
                        fontFamily='font.body'
                        textAlign='justify'
                      >
                        {question.text}
                      </Text>
                      <Stack mt={3} spacing='15px'>
                        {question.options.map((option, optionIndex) => {
                          // Calculate the total count for the question to use for percentage calculation
                          const totalCountForQuestion = question.options.reduce(
                            (acc, curr) => acc + curr.count,
                            0
                          )
                          const percentage =
                            totalCountForQuestion > 0
                              ? (option.count / totalCountForQuestion) * 100
                              : 0
                          return (
                            <Box key={option.id} ml={5}>
                              <Text fontSize='sm' fontFamily='font.body'>
                                {option.text} (Votes:{' '}
                                <span className='font-semibold'>
                                  {option.count}
                                </span>
                                )
                              </Text>
                              <Progress
                                colorScheme='yellow'
                                size='sm'
                                value={percentage}
                              />
                            </Box>
                          )
                        })}
                      </Stack>
                    </Box>
                  </React.Fragment>
                ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
