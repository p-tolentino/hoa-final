'use client'

import React from 'react'
import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { MaintenanceRecordColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface MaintenanceRecordClientProps {
  data: MaintenanceRecordColumn[]
  hoaInfo: Hoa
}

export const MaintenanceRecordClient: React.FC<
  MaintenanceRecordClientProps
> = ({ data, hoaInfo }) => {
  // Page Title and Description
  const pageTitle = `HOA Maintenance Record`
  const pageDescription = `Manage and view the maintenance record within the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `The consolidated list of maintenance reports within the Homeowners' Association.`

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
      <DataTable columns={columns} data={data} searchKey='type' />
    </>
  )
}
