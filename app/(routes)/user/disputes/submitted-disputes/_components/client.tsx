'use client'

import React from 'react'
import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { SubmittedDisputesColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface SubmittedDisputesClientProps {
  data: SubmittedDisputesColumn[]
  hoaInfo: Hoa
}

export const SubmittedDisputesClient: React.FC<
  SubmittedDisputesClientProps
> = ({ data, hoaInfo }) => {
  // Page Title and Description
  const pageTitle = `Submitted Dispute Forms`
  const pageDescription = `Monitor the progress of your submitted dispute forms to the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `View the consolidated list of your submitted dispute forms within the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Status', accessor: 'status' },
    { header: 'Dispute Case No.', accessor: 'number' },
    { header: 'Date Submitted', accessor: 'createdAt' },
    { header: 'Type', accessor: 'type' },
    { header: 'Progress', accessor: 'progress' }
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
