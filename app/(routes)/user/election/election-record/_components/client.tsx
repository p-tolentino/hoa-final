'use client'

import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { ElectionRecordColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'
import { useCurrentUser } from '@/hooks/use-current-user'

interface ElectionRecordClientProps {
  data: ElectionRecordColumn[]
  hoaInfo: Hoa
}

export const ElectionRecordClient: React.FC<ElectionRecordClientProps> = ({
  data,
  hoaInfo
}) => {
  // Page Title and Description
  const pageTitle = `HOA Election Record`
  const pageDescription1 = `Manage and view the election record within the Homeowners' Association. (Note: The MIS will only retain the a total of three (3) election reports to save storage) `
  const pageDescription2 =
    "Access the election record of the Homeowners' Association."

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `View the consolidated list of election reports within the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Election Term', accessor: 'termOfOffice' },
    { header: 'Election Period', accessor: 'period' },
    { header: 'Required Votes', accessor: 'requiredVotes' },
    { header: 'Voter Turnout', accessor: 'voterTurnout' },
    { header: 'Status', accessor: 'status' }
  ]

  const user = useCurrentUser()

  return (
    <>
      <Heading
        title={pageTitle}
        description={
          user?.info.committee === 'Election Committee'
            ? pageDescription1
            : pageDescription2
        }
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
