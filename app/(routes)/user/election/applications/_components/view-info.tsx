'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Stack,
  Text,
  Box,
  Button,
  HStack,
  useDisclosure,
  OrderedList,
  ListItem,
  UnorderedList
} from '@chakra-ui/react'

import { useState } from 'react'
import { ElectionApplicationsColumn } from './columns'

interface InfoProps {
  candidateInfo: ElectionApplicationsColumn
}

export default function ViewInfo ({ candidateInfo }: InfoProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            fontFamily='font.body'
            colorScheme='green'
            variant='ghost'
            size='sm'
          >
            View Candidate Information
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{candidateInfo.application.fullName}</DialogTitle>
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
                    {candidateInfo.application.homeownerSince} years
                  </Text>
                </HStack>
                <Stack>
                  <Text fontSize='sm' fontWeight='semibold'>
                    Platforms:
                  </Text>
                  <OrderedList ml={5}>
                    {candidateInfo.application.platforms.map(
                      (platform, index) => (
                        <ListItem key={`Platform ${index}`}>
                          {platform}
                        </ListItem>
                      )
                    )}
                  </OrderedList>
                </Stack>
                <Box>
                  <Text fontSize='sm' fontWeight='semibold'>
                    Skills:
                  </Text>
                  <Text fontSize='sm'>
                    {candidateInfo.application.skills.join(', ')}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize='sm' fontWeight='semibold'>
                    Educational Background:
                  </Text>
                  <UnorderedList ml={5}>
                    {candidateInfo.educBackground.map((edu, index) => (
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
                    {candidateInfo.workExperience.map((work, index) => (
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
