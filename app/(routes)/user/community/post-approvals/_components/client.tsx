'use client'

import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { PendingPostColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'

interface PendingPostClientProps {
  data: PendingPostColumn[]
}

export const PendingPostClient: React.FC<PendingPostClientProps> = ({
  data
}) => {
  // Page Title and Description
  const pageTitle = `Posts for Approval (${data.length})`
  const pageDescription = `Manage user posts that will be reflected in the Community Engagement module.`

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      {/* Data Table */}
      <DataTable columns={columns} data={data} searchKey='title' />
    </>
  )
}
