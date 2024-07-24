'use client'

import { FaFilePdf } from 'react-icons/fa'
import { Heading } from '@/components/ui/heading'
import { useReactToPrint } from 'react-to-print'
import { ElectionSettings, Candidates, VoteResponse, Hoa } from '@prisma/client'
import {
  ButtonGroup,
  Stack,
  Text,
  Box,
  Progress,
  HStack,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  Center
} from '@chakra-ui/react'
import { Heading as HeadingChakra } from '@chakra-ui/react'
import React, { useRef } from 'react'
import BackButton from '@/components/system/BackButton'
import NextImage from 'next/image'
import SystemLogo from '@/public/HOAs.is-logo.png'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'

interface ReportProps {
  candidates: Candidates[]
  responses: VoteResponse[]
  electionInfo: ElectionSettings
  activeUsers: number
  hoaInfo: Hoa
}

export default function ElectionReport ({
  candidates,
  responses,
  electionInfo,
  activeUsers,
  hoaInfo
}: ReportProps) {
  // Page Title and Description
  const pageTitle = `${electionInfo.termOfOffice} Election Report`
  const pageDescription = `View the election report of a particular HOA election.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `${pageDescription}`

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const totalVoters = new Set(responses.map(response => response.userId)).size
  const candidateVotes = candidates.map(candidate => {
    const voteCount = responses.filter(
      response => response.candidateId === candidate.id
    ).length
    return {
      ...candidate,
      voteCount
    }
  })

  // Sort candidates by the number of votes to determine winners
  candidateVotes.sort((a, b) => b.voteCount - a.voteCount)

  const winnersCount = electionInfo.totalBoardMembers // Number of winners based on election settings
  const winners = candidateVotes.slice(0, winnersCount)

  const componentPDF = useRef<HTMLDivElement | null>(null)

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null,
    documentTitle: "Homeowners' Association Election Record"
  })

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <Button
              size='sm'
              variant='outline'
              colorScheme='orange'
              leftIcon={<FaFilePdf />}
              onClick={generatePDF}
            >
              Generate PDF
            </Button>
            <BackButton />
          </ButtonGroup>
        }
      />
      <Box
        p={5}
        overflowY='auto'
        h='75vh'
        border='1px'
        borderColor='gray.200'
        borderRadius='md'
        boxShadow='md'
        pb={10}
      >
        <div ref={componentPDF}>
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
            <Box mt={5} mb={3}>
              <HeadingChakra
                fontSize='xl'
                textAlign='center'
                fontFamily='font.heading'
              >
                {reportTitle}
              </HeadingChakra>
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
            <Stack spacing='15px' mt={5} mx={5}>
              <Flex justifyContent='space-between'>
                <SimpleGrid columns={2} spacingX={5} w='max-content'>
                  <Text fontSize='md' fontWeight='semibold' w='max-content'>
                    Election Term:
                  </Text>
                  <Text fontSize='md' w='max-content'>
                    {electionInfo.termOfOffice}
                  </Text>
                  <Text fontSize='md' fontWeight='semibold' w='max-content'>
                    Election Period:
                  </Text>
                  <Text fontSize='md' w='max-content'>
                    {format(
                      electionInfo.startElectDate.toISOString().slice(0, 10),
                      'dd MMM yyyy'
                    )}{' '}
                    -{' '}
                    {format(
                      electionInfo.endElectDate.toISOString().slice(0, 10),
                      'dd MMM yyyy'
                    )}
                  </Text>
                  <Text fontSize='md' fontWeight='semibold' w='max-content'>
                    Total Members to Elect:
                  </Text>
                  <Text fontSize='md' w='max-content'>
                    {electionInfo.totalBoardMembers} Candidates
                  </Text>
                </SimpleGrid>
                <HStack spacing={3} align='top' lineHeight={1.2}>
                  <Text fontSize='md' fontWeight='semibold' w='max-content'>
                    Voter Turnout:
                  </Text>

                  <Text
                    fontSize='md'
                    w='max-content'
                    fontWeight='bold'
                    color={
                      totalVoters < electionInfo.requiredVotes ? 'red' : 'green'
                    }
                  >
                    {totalVoters} out of {activeUsers} active users <br />(
                    {electionInfo.requiredVotes} required voters)
                    <br />
                    {totalVoters < electionInfo.requiredVotes ? (
                      <TriangleDownIcon />
                    ) : (
                      <TriangleUpIcon />
                    )}{' '}
                    {((totalVoters / activeUsers) * 100).toFixed(2)}%
                  </Text>
                </HStack>
              </Flex>
              <Divider />
              {totalVoters !== 0 ? (
                <>
                  <Text fontSize='lg' fontWeight='bold' mt={5}>
                    Results of the Election by Candidate:
                  </Text>
                  <SimpleGrid columns={2} spacing={5}>
                    {candidateVotes.map(candidate => (
                      <Box
                        key={candidate.id}
                        p={4}
                        border='1px'
                        borderColor='gray.300'
                        borderRadius='md'
                        w='100%'
                      >
                        <Text
                          fontSize='md'
                          fontWeight='bold'
                          color={
                            winners.includes(candidate) ? 'brand.500' : 'black'
                          }
                        >
                          {candidate.fullName}:
                        </Text>
                        <Box mt={2}>
                          <Text fontSize='md' lineHeight={1}>
                            {candidate.voteCount} votes (
                            {(
                              (candidate.voteCount / (activeUsers * 4)) *
                              100
                            ).toFixed(2)}
                            %)
                          </Text>
                          <Progress
                            colorScheme='yellow'
                            size='sm'
                            value={(candidate.voteCount / totalVoters) * 100}
                            mt={2}
                          />
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                </>
              ) : (
                <Center color='lightgrey' fontFamily='font.body'>
                  No results to show yet.
                </Center>
              )}
            </Stack>
          </Box>
        </div>
      </Box>
    </>
  )
}
