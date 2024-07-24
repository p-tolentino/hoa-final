'use client'

import { Heading } from '@/components/ui/heading'
import React, { useEffect, useState } from 'react'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'
import {
  Stack,
  Text,
  Box,
  Progress,
  HStack,
  ButtonGroup
} from '@chakra-ui/react'

// You might consider this
// Reference: https://www.theedenshores.org/archive/html/2020_hoa_board_election_results.html

export default function ElectionReport () {
  // Page Title and Description
  const pageTitle = `[YYYY-YYYY] Election Report`
  const pageDescription = `View the report of a particular election within the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `${pageDescription}.`

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            {/* <GeneratePDFButton
              reportTitle={reportTitle}
              reportSubtitle={reportSubtitle}
              columns={reportTableColumns}
              data={data}
              hoaInfo={hoaInfo}
            /> */}
            <BackButton />
          </ButtonGroup>
        }
      />

      {/* Election Report */}
      <Box p='10px' maxH='300px' overflowY='auto' mt={5}>
        <Stack spacing='15px'>
          <HStack spacing={5}>
            <Text fontSize='sm' fontWeight='semibold'>
              Total No. of Members who voted:
            </Text>
            <Text fontSize='sm'>20</Text>
          </HStack>
          <Text fontSize='sm' fontWeight='semibold'>
            Candidate Name:
          </Text>
          <Box>
            <Text fontSize='sm' fontFamily='font.body'>
              Name + count
            </Text>
            <Progress colorScheme='yellow' size='sm' value={20} />
          </Box>
          <Box>
            <Text fontSize='sm' fontFamily='font.body'>
              Name + count
            </Text>
            <Progress colorScheme='yellow' size='sm' value={20} />
          </Box>
          <Box>
            <Text fontSize='sm' fontFamily='font.body'>
              Name + count
            </Text>
            <Progress colorScheme='yellow' size='sm' value={20} />
          </Box>
        </Stack>
      </Box>
    </>
  )
}
