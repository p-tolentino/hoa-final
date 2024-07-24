'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { PaymentStatus } from '@prisma/client'
import { CellAction } from './cell-action'
import { format } from 'date-fns'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export type TransactionRecordColumn = {
  id: string
  address: string
  status: string
  amount: string
  dateIssued: string
  datePaid: string
  purpose: string
  description: string
  paidBy: string
}

export const columns: ColumnDef<TransactionRecordColumn>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) =>
      row.getValue('status') !== PaymentStatus.UNSETTLED ? (
        <Badge
          className={cn(
            'w-[100px] md:text-xs p-2 ml-3 text-center justify-center break-text',
            {
              'bg-green-700': row.getValue('status') === PaymentStatus.PAID,
              'bg-red-700': row.getValue('status') === PaymentStatus.OVERDUE,
              'bg-yellow-600':
                row.getValue('status') === PaymentStatus.UNPAID ||
                row.getValue('status') === PaymentStatus.UNSETTLED,
              hidden: ![
                PaymentStatus.PAID,
                PaymentStatus.OVERDUE,
                PaymentStatus.UNPAID
              ].includes(row.getValue('status'))
            }
          )}
        >
          {row.getValue('status')}
        </Badge>
      ) : (
        <div className='text-gray-300 italic text-center'>N/A</div>
      )
  },
  {
    accessorKey: 'address',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Billed To
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='capitalize pl-4'>
        {row.getValue('address') ? (
          row.getValue('address')
        ) : (
          <span className='text-gray-300'>N/A</span>
        )}
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div className='flex justify-center w-[150px]'>
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
      <div className='flex justify-end pr-8'>
        {formatCurrency(row.getValue('amount'))}
      </div>
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
    cell: ({ row }) => (
      <div className='capitalize pl-4'>{row.getValue('purpose')}</div>
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
    cell: ({ row }) => (
      <div className='pl-4'>
        {format(row.getValue('dateIssued'), 'dd MMM yyy')}
      </div>
    )
  },
  // {
  //   accessorKey: 'datePaid',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant='ghost'
  //         className='hover:bg-[#ffe492]'
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Date Paid
  //         <ArrowUpDown className='w-4 h-4 ml-2' />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => (
  //     <div className='pl-4'>
  //       {row.getValue('datePaid') ? (
  //         row.getValue('datePaid')
  //       ) : (
  //         <span className='text-gray-300 italic'>N/A</span>
  //       )}
  //     </div>
  //   )
  // },
  // {
  //   accessorKey: 'paidBy',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant='ghost'
  //         className='hover:bg-[#ffe492]'
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Paid By
  //         <ArrowUpDown className='w-4 h-4 ml-2' />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => (
  //     <div className='pl-4'>
  //       {row.getValue('paidBy') ? (
  //         row.getValue('paidBy')
  //       ) : (
  //         <span className='text-gray-300 italic'>N/A</span>
  //       )}
  //     </div>
  //   )
  // },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
