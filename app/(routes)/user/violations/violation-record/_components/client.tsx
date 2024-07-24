'use client'
import React from 'react'
import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { ListOfViolationsColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface ListOfViolationsClientProps {
  data: ListOfViolationsColumn[]
  hoaInfo: Hoa
}

export const ListOfViolationsClient: React.FC<ListOfViolationsClientProps> = ({
  data,
  hoaInfo
}) => {
  // Page Title and Description
  const pageTitle = `HOA Violation Record`
  const pageDescription = `Manage the violation record in the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `The consolidated list of violation reports of the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Status', accessor: 'status' },
    { header: 'Violation Case No.', accessor: 'number' },
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
