'use client'

import { Candidates } from '@prisma/client'
import {
  Stack,
  Text,
  Box,
  Button,
  HStack,
  OrderedList,
  ListItem,
  UnorderedList
} from '@chakra-ui/react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface InfoProps {
  candidateInfo: Candidates
}

interface Education {
  year: string
  institution: string
}

interface WorkExperience {
  year: string
  company: string
}

function parseJsonArray<T> (jsonArray: string[]): T[] {
  try {
    return jsonArray.map(jsonString => JSON.parse(jsonString) as T)
  } catch (error) {
    console.error('Error parsing JSON array:', error)
    return []
  }
}

export default function ViewInfo ({ candidateInfo }: InfoProps) {
  const educBackground: Education[] = parseJsonArray<Education>(
    candidateInfo.educBackground
  )
  const workExperience: WorkExperience[] = parseJsonArray<WorkExperience>(
    candidateInfo.workExperience
  )

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size='sm'
            fontFamily='font.body'
            fontWeight='normal'
            colorScheme='blue'
            variant='link'
          >
            (View Candidate Information)
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{candidateInfo.fullName}</DialogTitle>
            <DialogDescription>Candidate Information</DialogDescription>
          </DialogHeader>
          <DialogDescription>
            <Box
              p='10px'
              maxH='500px'
              overflowY='auto'
              mb={5}
              color='black'
              textAlign='justify'
            >
              <Stack spacing='20px'>
                <HStack spacing={5}>
                  <Text fontSize='sm' fontWeight='semibold'>
                    Homeowner Membership Duration:
                  </Text>
                  <Text fontSize='sm'>
                    {candidateInfo.homeownerSince} years
                  </Text>
                </HStack>
                <Stack>
                  <Text fontSize='sm' fontWeight='semibold'>
                    Platforms:
                  </Text>
                  <OrderedList ml={5}>
                    {candidateInfo.platforms.map((platform, index) => (
                      <ListItem key={`Platform ${index}`}>{platform}</ListItem>
                    ))}
                  </OrderedList>
                </Stack>
                <Box>
                  <Text fontSize='sm' fontWeight='semibold'>
                    Skills:
                  </Text>
                  <Text fontSize='sm'>{candidateInfo.skills.join(', ')}</Text>
                </Box>
                <Box>
                  <Text fontSize='sm' fontWeight='semibold'>
                    Educational Background:
                  </Text>
                  <UnorderedList ml={5}>
                    {educBackground.map((edu, index) => (
                      <ListItem key={index} fontSize='sm'>
                        {edu.year} - {edu.institution}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
                <Box>
                  <Text fontSize='sm' fontWeight='semibold'>
                    Work Experience:
                  </Text>
                  <UnorderedList ml={5}>
                    {workExperience.map((work, index) => (
                      <ListItem key={index} fontSize='sm'>
                        {work.year} - {work.company} Year
                        {parseInt(work.year) > 1 ? 's' : ''}
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </Stack>
            </Box>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}
