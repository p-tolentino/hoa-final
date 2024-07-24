'use client'

import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { TransactionRecordColumn, columns } from './columns'
import { HStack, Spacer, ButtonGroup, Text } from '@chakra-ui/react'
import React, { useState, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import BackButton from '@/components/system/BackButton'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'

interface TransactionRecordClientProps {
  data: TransactionRecordColumn[]
  hoaInfo: Hoa
}

export const TransactionRecordClient: React.FC<
  TransactionRecordClientProps
> = ({ data, hoaInfo }) => {
  // Page Title and Description
  const pageTitle = `Homeowners' Transaction Record (${data.length})`
  const pageDescription = `Access the transaction records of all homeowners in the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `${pageTitle}`
  const reportSubtitle = `View the transaction records of all homeowners within the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Status', accessor: 'status' },
    { header: 'Billed To', accessor: 'address' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Purpose ', accessor: 'purpose' },
    // { header: 'Description', accessor: 'description' },
    { header: 'Date Issued', accessor: 'dateIssued' }
    // { header: 'Date Paid', accessor: 'datePaid' },
    // { header: 'Paid By', accessor: 'paidBy' }
  ]

  const [selectedStatusFilter, setSelectedStatusFilter] = useState('showAll')
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState('showAll')

  // Filter the data based on the selected status filter
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Check status filter
      const statusMatch =
        selectedStatusFilter === 'showAll' ||
        item.status === selectedStatusFilter
      // Check category filter
      const categoryMatch =
        selectedCategoryFilter === 'showAll' ||
        item.purpose === selectedCategoryFilter // Assuming 'category' is the correct field

      return statusMatch && categoryMatch
    })
  }, [data, selectedStatusFilter, selectedCategoryFilter])

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

      <HStack>
        {/* Select category to show */}
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

        {/* Filter status to show */}
        <Select
          value={selectedStatusFilter}
          onValueChange={value => setSelectedStatusFilter(value)}
        >
          <SelectTrigger className='w-[250px]'>
            <SelectValue placeholder='Filter Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='showAll' className='font-semibold'>
                Show All (Status)
              </SelectItem>

              <SelectItem value='PAID'>Paid</SelectItem>
              <SelectItem value='UNPAID'> Unpaid</SelectItem>
              <SelectItem value='OVERDUE'>Overdue</SelectItem>
              <SelectItem value='UNSETTLED'>Usettled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </HStack>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchKey='purpose'
        height='49vh'
      />
    </>
  )
}
