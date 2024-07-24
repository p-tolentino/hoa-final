import { Heading } from '@/components/ui/heading'
import { getHoaInfo } from '@/server/data/hoa-info'
import { Box, ButtonGroup, Stack } from '@chakra-ui/react'
import BackButton from '@/components/system/BackButton'
import PayPenaltyFee from './_components/PayPenaltyFee'
import AppealViolations from './_components/AppealViolations'
import ViolationMonitoring from './_components/ViolationMonitoring'

export default async function ViolationProcess () {
  // Page Title and Description
  const pageTitle = `Violation Monitoring Process Guide`
  const pageDescription = `Read more about the violation monitoring process in the Homeowners' Association.`

  const hoa = await getHoaInfo()
  if (!hoa) {
    return null
  }

  return (
    <div>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <Stack spacing='30px'>
        {/* Violation Monitoring */}
        <Box id='violationMonitoring'>
          <ViolationMonitoring hoa={hoa} />
        </Box>
        {/* Appeal Violations */}
        <Box id='appealViolations'>
          <AppealViolations />
        </Box>
        {/* Pay Penalty Fee */}
        <Box id='payPenaltyFee'>
          <PayPenaltyFee />
        </Box>
      </Stack>
    </div>
  )
}
