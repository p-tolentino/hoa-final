'use client'

import { Hoa } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { DataTable } from '@/components/ui/data-table'
import { useCurrentUser } from '@/hooks/use-current-user'
import { TransactionColumn, columns } from './columns'
import { Stack, Text, Flex, ButtonGroup } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import BackButton from '@/components/system/BackButton'
import NewTransactionButton from './NewTransactionButton'
import CompareMonthlyReports from './compare-report'
import GeneratePDFButton from '@/components/system/GeneratePDFButton'
import GenerateMonthlyReports from './monthly-report'

interface TransactionClientProps {
  data: TransactionColumn[]
  hoaInfo: Hoa
}

export const TransactionClient: React.FC<TransactionClientProps> = ({
  data,
  hoaInfo
}) => {
  const [sortedData, setSortedData] = useState<TransactionColumn[]>([])
  useEffect(() => {
    // Sort data by dateIssued in ascending order
    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.dateIssued)
      const dateB = new Date(b.dateIssued)
      return dateB.getTime() - dateA.getTime()
    })
    setSortedData(sorted)
  }, [data]) // Depend on data to re-sort when it changes

  // Page Title and Description
  const pageTitle = `Revenue & Expense\n Management (${data.length})`
  const pageDescription = `Manage the revenues and expenses in the Homeowners' Association.`

  // Report Title and Description
  const reportTitle = `Revenue & Expense Transactions Report`
  const reportSubtitle = `The consolidated list of  revenue and expenses transactions in the Homeowners' Association.`

  // Report Table Columns in Generate PDF
  const reportTableColumns = [
    { header: 'Date Issued', accessor: 'dateIssued' },
    { header: 'Type', accessor: 'type' },
    { header: 'Purpose', accessor: 'purpose' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Recorded By', accessor: 'recordedBy' }
  ]

  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(numericAmount)
  }

  const user = useCurrentUser()

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

      {/* Top Section */}
      <Flex justifyContent='space-between'>
        {/* Total Funds */}
        <Stack lineHeight={0.8}>
          <Text fontFamily={'fonts.body'} fontWeight='semibold'>
            Total Funds:
          </Text>
          <Text
            fontSize={'2xl'}
            fontWeight={'bold'}
            color={hoaInfo.funds > 0 ? 'brand.500' : 'red.500'}
          >
            {formatCurrency(hoaInfo.funds)}
          </Text>
        </Stack>
        {/* Actions */}
        <ButtonGroup>
          <GenerateMonthlyReports />
          <CompareMonthlyReports />
          {(user?.info?.position === 'Treasurer' ||
            user?.info?.position === 'Auditor' ||
            user?.info.committee === 'Finance Committee' ||
            user?.role === 'SUPERUSER') && (
            <NewTransactionButton currentFunds={hoaInfo.funds} />
          )}
        </ButtonGroup>
      </Flex>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedData}
        searchKey='purpose'
        height='49vh'
      />
    </>
  )
}
