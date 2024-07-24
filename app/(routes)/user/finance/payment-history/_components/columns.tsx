'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { PaymentStatus } from '@prisma/client'
import { format } from 'date-fns'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export type PaymentHistoryColumn = {
  id: string
  status: string
  amount: string
  createdAt: string
  purpose: string
  description: string
  paidBy: string
}

export const columns: ColumnDef<PaymentHistoryColumn>[] = [
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
    accessorKey: 'datePaid',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date Paid
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='pl-4'>
        {row.getValue('datePaid') ? (
          format(row.getValue('datePaid'), 'dd MMM yyyy')
        ) : (
          <span className='text-gray-300 italic'>N/A</span>
        )}
      </div>
    )
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Description
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='pl-4 w-[300px] text-justify'>
        {row.getValue('description')}
      </div>
    )
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div className='flex justify-end'>
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
  }
]
