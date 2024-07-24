'use client'

import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { ElectionApplicationsColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface ElectionApplicationsClientProps {
  data: ElectionApplicationsColumn[]
  hoaInfo: Hoa
}

export const ElectionApplicationsClient: React.FC<
  ElectionApplicationsClientProps
> = ({ data, hoaInfo }) => {
  // Page Title and Description
  const pageTitle = `Election Candidate Applications`
  const pageDescription = `Manage and view all election candidate applciations within the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `View the consolidated list of election candidate applications within the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Election Term', accessor: 'term' },
    { header: 'Status', accessor: 'status' },
    { header: 'Applicant', accessor: 'applicant' }
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
      <DataTable columns={columns} data={data} searchKey='term' />
    </>
  )
}
