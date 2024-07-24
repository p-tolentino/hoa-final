'use client'

import React from 'react'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { ButtonGroup } from '@chakra-ui/react'
import { ViolationLettersAndNoticesColumn, columns } from './columns'
import BackButton from '@/components/system/BackButton'

interface ViolationLettersAndNoticesClientProps {
  data: ViolationLettersAndNoticesColumn[]
}

export const ViolationLettersAndNoticesClient: React.FC<
  ViolationLettersAndNoticesClientProps
> = ({ data }) => {
  // Page Title and Description
  const pageTitle = `Violation Letters and Notices`
  const pageDescription = `ccess your received violation letters and notices from the Homeowners' Association.`

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
