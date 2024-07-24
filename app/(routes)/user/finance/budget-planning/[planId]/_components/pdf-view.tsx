import React from 'react'
import ViewExpenseTable from './expenses-view'
import ViewRevenueTable from './revenue-view'
import ViewTotalTable from './totals-view'
import { BudgetPlan, Hoa } from '@prisma/client'
import { Heading, Box, Text, Stack, Flex } from '@chakra-ui/react'
import NextImage from 'next/image'
import SystemLogo from '@/public/HOAs.is-logo.png'

interface ViewFormProps {
  initialData: BudgetPlan | null
  previous: BudgetPlan | null
  hoaInfo: Hoa
  reportTitle: string
  reportSubtitle: string
}

export default function PdfView ({
  initialData,
  previous,
  hoaInfo,
  reportTitle,
  reportSubtitle
}: ViewFormProps) {
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
        <Box mt={5} mb={3}>
          <Heading fontSize='xl' textAlign='center' fontFamily='font.heading'>
            {reportTitle}
          </Heading>
          <Text
            fontSize='xl'
            textAlign='center'
            color='gray.600'
            fontFamily='font.body'
          >
            {reportSubtitle}
          </Text>
          <Text
            textAlign='center'
            color='gray.500'
            fontFamily='font.body'
            mt={1}
          >
            Date Generated: {currentDate}
          </Text>
        </Box>

        <Stack spacing={10} mt={5}>
          {/* Revenue Details */}
          <Box>
            <ViewRevenueTable plan={initialData} previous={previous} />
          </Box>
          {/* Expense Details */}
          <Box className='page-break-auto'>
            <ViewExpenseTable plan={initialData} previous={previous} />
          </Box>
          {/* Total Overview */}
          <Box className='page-break-auto'>
            <ViewTotalTable plan={initialData} previous={previous} />
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}
