'use client'

import { Hoa, Facility } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup, Text } from '@chakra-ui/react'
import { ReservationsMadeColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface ReservationsMadeClientProps {
  data: ReservationsMadeColumn[]
  hoaInfo: Hoa
}

export const ReservationsMadeClient: React.FC<ReservationsMadeClientProps> = ({
  data,
  hoaInfo
}) => {
  // Page Title and Description
  const pageTitle = `HOA Facility Reservation Record`
  const pageDescription = `Access the HOA facility reservation record in the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `The consolidated list of your facility reservations in the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Facility', accessor: 'facility' },
    { header: 'Start Date & Time', accessor: 'startTime' },
    { header: 'End Date & Time', accessor: 'endTime' },
    { header: 'Reservation Fee', accessor: 'reservationFee' },
    { header: 'Reserved by', accessor: 'userName' }
  ]

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <GeneratePDFButton
              reportTitle={reportTitle}
              reportSubtitle={reportSubtitle}
              columns={reportTableColumns}
              data={data}
              hoaInfo={hoaInfo}
            />
            <BackButton />
          </ButtonGroup>
        }
      />

      {/* Data Table */}
      <DataTable columns={columns(hoaInfo)} data={data} searchKey='facility' />
    </>
  )
}
