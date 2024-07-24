'use client'

import React from 'react'
import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { ListOfDisputesColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface ListOfDisputesClientProps {
  data: ListOfDisputesColumn[]
  hoaInfo: Hoa
}

export const ListOfDisputesClient: React.FC<ListOfDisputesClientProps> = ({
  data,
  hoaInfo
}) => {
  // Page Title and Description
  const pageTitle = `HOA Dispute Record`
  const pageDescription = `Manage the dispute record in the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `The consolidated list of dispute reports of the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Status', accessor: 'status' },
    { header: 'Dispute Case No.', accessor: 'number' },
    { header: 'Date Reported', accessor: 'createdAt' },
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
      <DataTable columns={columns} data={data} searchKey='type' />
    </>
  )
}
