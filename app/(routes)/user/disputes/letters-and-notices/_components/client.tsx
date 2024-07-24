'use client'

import React from 'react'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { DisputeLettersAndNoticesColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'

interface DisputeLettersAndNoticesClientProps {
  data: DisputeLettersAndNoticesColumn[]
}

export const DisputeLettersAndNoticesClient: React.FC<
  DisputeLettersAndNoticesClientProps
> = ({ data }) => {
  // Page Title and Description
  const pageTitle = `Dispute Letters and Notices`
  const pageDescription = `View received dispute letters and notices from the Homeowners' Association.`

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
      <DataTable columns={columns} data={data} searchKey='createdAt' />
    </>
  )
}
