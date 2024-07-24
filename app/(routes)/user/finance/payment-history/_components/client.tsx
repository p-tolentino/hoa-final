'use client'

import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { HStack, Spacer, ButtonGroup } from '@chakra-ui/react'
import { PaymentHistoryColumn, columns } from './columns'
import React, { useState, useMemo } from 'react'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface PaymentHistoryClientProps {
  data: PaymentHistoryColumn[]
  hoaInfo: Hoa
}

export const PaymentHistoryClient: React.FC<PaymentHistoryClientProps> = ({
  data,
  hoaInfo
}) => {
  // Page Title and Description
  const pageTitle = `Payment History (${data.length})`
  const pageDescription =
    "Access you payment history to the Homeowners' Association."

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `${pageDescription}`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Purpose ', accessor: 'purpose' },
    { header: 'Date Paid', accessor: 'datePaid' },
    { header: 'Description', accessor: 'description' },
    { header: 'Amount', accessor: 'amount' }
  ]

  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState('showAll')
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Check status and category filter
      const categoryMatch =
        selectedCategoryFilter === 'showAll' ||
        item.purpose === selectedCategoryFilter // Assuming 'category' is the correct field
      return categoryMatch
    })
  }, [data, selectedCategoryFilter])

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

      {/* Select category to show */}
      <HStack>
        <Select
          value={selectedCategoryFilter}
          onValueChange={value => setSelectedCategoryFilter(value)}
        >
          <SelectTrigger className='w-[250px]'>
            <SelectValue placeholder='Show All' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='showAll' className='font-semibold'>
                Show All (Purpose)
              </SelectItem>
              <SelectItem value='Association Dues'>Association Dues</SelectItem>
              <SelectItem value='Dispute Fees'>Dispute Fees</SelectItem>
              <SelectItem value='Violation Fines'>Violation Fines</SelectItem>
              <SelectItem value='Facility Rentals'>
                Facility Reservation Fees
              </SelectItem>
              <SelectItem value='Repair and Maintenance'>
                Maintenance Fees
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Spacer />
      </HStack>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchKey='datePaid'
        height='49vh'
      />
    </>
  )
}
