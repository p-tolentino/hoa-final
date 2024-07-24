'use client'

import { Hoa } from '@prisma/client'
import { useRef } from 'react'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { Separator } from '@/components/ui/separator'
import { Button, ButtonGroup, HStack } from '@chakra-ui/react'
import { ElectionContactsColumn, columns } from './columns'
import { useReactToPrint } from 'react-to-print'
import React from 'react'
import PDFTable from '@/components/system/PDFTable'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface ElectionContactsClientProps {
  data: ElectionContactsColumn[]
  hoaInfo: Hoa
}

export const ElectionContactsClient: React.FC<ElectionContactsClientProps> = ({
  data,
  hoaInfo
}: ElectionContactsClientProps) => {
  // Page Title and Description
  const pageTitle = `Election Commmittee Contact Details`
  const pageDescription = `Access the contacts details of the election committee in the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `${pageDescription}`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Phone Number', accessor: 'phoneNumber' },
    { header: 'Email', accessor: 'email' }
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
      <DataTable columns={columns} data={data} searchKey='name' />
    </>
  )
}
