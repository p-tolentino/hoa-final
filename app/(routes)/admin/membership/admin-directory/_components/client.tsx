'use client'

import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { AdminColumn, columns } from './columns'
import React from 'react'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface AdminsClientProps {
  data: AdminColumn[]
  hoaInfo: Hoa
}

export const AdminsClient: React.FC<AdminsClientProps> = ({
  data,
  hoaInfo
}: AdminsClientProps) => {
  // Page Title and Description
  const pageTitle = `Admin & Board of Directors (${data.length})`
  const pageDescription = `Access the consolidated list of system admins and officers, along with their respective information.
`

  // Report Title and Descriptionv
  const reportTitle = `Admin & Officer Directory`
  const reportSubtitle = pageDescription.replace('Access the', 'The')

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Position', accessor: 'position' },
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
      <DataTable columns={columns} data={data} searchKey='position' />
    </>
  )
}
