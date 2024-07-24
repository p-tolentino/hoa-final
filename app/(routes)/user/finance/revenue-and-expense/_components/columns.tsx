'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ColumnDef, Row } from '@tanstack/react-table'
import { Flex, Text } from '@chakra-ui/react'
import { CellAction } from './cell-action'
import { ArrowUpDown } from 'lucide-react'
import { HoaTransactionType } from '@prisma/client'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export type TransactionColumn = {
  id: string
  recordedBy: string
  dateSubmitted: string
  dateIssued: string
  type: string
  purpose: string
  amount: string
  description: string
}

// Custom sorting function for dates
const dateSort = (
  rowA: Row<TransactionColumn>,
  rowB: Row<TransactionColumn>,
  columnId: string
): number => {
  const dateA = new Date(rowA.getValue(columnId) as string)
  const dateB = new Date(rowB.getValue(columnId) as string)

  return dateA.getTime() - dateB.getTime()
}

export const columns: ColumnDef<TransactionColumn>[] = [
  {
    accessorKey: 'dateIssued',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date Issued
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-5'>{row.getValue('dateIssued')}</div>,
    sortingFn: dateSort // Add the custom sorting function here
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Badge
        className={cn(
          'w-[80px] md:text-xs p-2 ml-3 text-center justify-center break-text',
          row.getValue('type') === HoaTransactionType.REVENUE
            ? 'bg-green-700'
            : row.getValue('type') === HoaTransactionType.EXPENSE
            ? 'bg-red-700'
            : 'display-none'
        )}
      >
        {row.getValue('type')}
      </Badge>
    )
  },
  {
    accessorKey: 'purpose',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Purpose
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-4'>{row.getValue('purpose')}</div>
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div className='w-[150px]'>
          <Button
            variant='ghost'
            className='hover:bg-[#ffe492]'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Amount
            <ArrowUpDown className='w-4 h-4 ml-2' />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className='flex justify-end pr-[100px]'>
        {formatCurrency(row.getValue('amount'))}
      </div>
    )
  },
  // {
  //   accessorKey: 'description',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant='ghost'
  //         className='hover:bg-[#ffe492]'
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Description
  //         <ArrowUpDown className='w-4 h-4 ml-2' />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div className='pl-4'>{row.getValue('description')}</div>
  // },
  // {
  //   accessorKey: 'dateSubmitted',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant='ghost'
  //         className='hover:bg-[#ffe492]'
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Date Recorded
  //         <ArrowUpDown className='w-4 h-4 ml-2' />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => (
  //     <div className='pl-4'>{row.getValue('dateSubmitted')}</div>
  //   )
  // },
  {
    accessorKey: 'recordedBy',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Recorded By
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-4'>{row.getValue('recordedBy')}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
