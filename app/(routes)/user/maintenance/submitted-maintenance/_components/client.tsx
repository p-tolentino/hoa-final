'use client'

import React from 'react'
import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { SubmittedMaintenanceColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface SubmittedMaintenanceClientProps {
  data: SubmittedMaintenanceColumn[]
  hoaInfo: Hoa
}

export const SubmittedMaintenanceClient: React.FC<
  SubmittedMaintenanceClientProps
> = ({ data, hoaInfo }) => {
  // Page Title and Description
  const pageTitle = `Submitted Maintenance Request Forms`
  const pageDescription = `Monitor the progress of your submitted maintenance request forms to the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `The consolidated list of your submitted maintenance request forms within the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Status', accessor: 'status' },
    { header: 'Ticket No.', accessor: 'number' },
    { header: 'Type', accessor: 'type' },
    { header: 'Date Requested', accessor: 'createdAt' },
    { header: 'View Progress', accessor: 'progress' }
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
      <DataTable columns={columns} data={data} searchKey='createdAt' />
    </>
  )
}
