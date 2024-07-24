import { Heading } from '@/components/ui/heading'
import { getHoaInfo } from '@/server/data/hoa-info'
import { Box, ButtonGroup, Stack } from '@chakra-ui/react'
import BackButton from '@/components/system/BackButton'
import DisputeResolution from './_components/DisputeResolution'

export default async function DisputeProcessGuide () {
  // Page Title and Description
  const pageTitle = `Dispute Resolution Process Guide`
  const pageDescription = `Read more about the dispute resolution process in the Homeowners' Association.`

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
        {/* Dispute Resolution */}
        <Box id='disputeResolution'>
          <DisputeResolution hoa={hoa} />
        </Box>
      </Stack>
    </div>
  )
}
