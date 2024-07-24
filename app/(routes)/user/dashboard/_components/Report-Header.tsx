import { Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { Hoa } from '@prisma/client'
import React from 'react'
import NextImage from 'next/image'
import SystemLogo from '@/public/HOAs.is-logo.png'

interface ReportHeaderProps {
  reportSection: string | null
  hoaInfo?: Hoa
}

// Get current date
const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const ReportHeader: React.FC<ReportHeaderProps> = ({
  reportSection,
  hoaInfo
}) => {
  return (
    <Box className='print-visible page-break'>
      <Stack spacing={3}>
        <Box className='report-content' alignSelf='center'>
          {/* Report Title, Subtitle, and Date */}
          <Box mt={reportSection === 'HOAs.is Dashboard' ? 5 : 0} mb={3}>
            <Heading fontSize='xl' textAlign='center' fontFamily='font.heading'>
              {reportSection} Report
            </Heading>
            <Text
              fontSize='sm'
              textAlign='center'
              color='gray.600'
              fontFamily='font.body'
            >
              The visual summaries of key information collected in the system.
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
        </Box>
      </Stack>
    </Box>
  )
}

export default ReportHeader
