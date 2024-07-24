import { Heading } from '@/components/ui/heading'
import { getHoaInfo } from '@/server/data/hoa-info'
import { Box, ButtonGroup, Stack } from '@chakra-ui/react'
import BackButton from '@/components/system/BackButton'
import MaintenanceHandling from './_components/MaintenanceHandling'

export default async function MaintenanceProcess () {
  // Page Title and Description
  const pageTitle = `Maintenance Handling Process Guide`
  const pageDescription = `Read more about the maintenance handling process within the Homeowners' Association.`

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

      <Stack spacing='50px'>
        {/* Maintenance Handling */}
        <Box id='maintenanceHandling'>
          <MaintenanceHandling hoa={hoa} />
        </Box>
      </Stack>
    </div>
  )
}
