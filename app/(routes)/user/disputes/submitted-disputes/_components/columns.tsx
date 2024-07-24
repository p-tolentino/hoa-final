'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PersonalInfo } from '@prisma/client'
import { Text } from '@chakra-ui/react'
import { format } from 'date-fns'

export type SubmittedDisputesColumn = {
  id: string
  number: number
  status: string
  createdAt: string
  officerAssigned: PersonalInfo | null | undefined
  disputeDate: string
  type: string
  description: string
  personComplained: PersonalInfo | null | undefined
  submittedBy: PersonalInfo | null | undefined
  step: number
  progress: string
  documents: string[]
  priority: string
  letterSent: boolean
  updatedAt: string
  reasonToClose?: string
}

export const columns: ColumnDef<SubmittedDisputesColumn>[] = [
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <>
        <Badge
          className={cn(
            'w-[150px] h-[min-content] px-3 py-2 text-center justify-center text-xs',
            row.getValue('status') === 'For Review'
              ? 'bg-yellow-700'
              : row.getValue('status') === 'For Assignment'
              ? 'bg-yellow-800'
              : row.getValue('status') === 'Pending Letter To Be Sent'
              ? 'bg-orange-800'
              : row.getValue('status') === 'Negotiating (Letter Sent)'
              ? 'bg-blue-900'
              : row.getValue('status') === 'For Final Review'
              ? 'bg-violet-500'
              : row.getValue('status') === 'Closed' &&
                row.original.reasonToClose === 'Unresolved'
              ? 'bg-gray-800'
              : row.getValue('status') === 'Closed' &&
                row.original.reasonToClose === 'Resolved'
              ? 'bg-green-700'
              : 'display-none'
          )}
        >
          {row.getValue('status') === 'Negotiating (Letter Sent)'
            ? row.original.status.slice(
                0,
                row.original.status.indexOf('(Letter Sent)')
              )
            : row.getValue('status') === 'Pending Letter To Be Sent'
            ? row.original.status.slice(
                0,
                row.original.status.indexOf('To Be Sent')
              )
            : row.getValue('status')}
        </Badge>
        <Text
          fontStyle='italic'
          fontSize='xs'
          w='150px'
          lineHeight={1}
          mt={1}
          textAlign='center'
        >
          {row.getValue('status') === 'Negotiating (Letter Sent)'
            ? 'Letter Sent'
            : row.original.reasonToClose && `${row.original.reasonToClose}`}
        </Text>
      </>
    )
  },
  {
    accessorKey: 'number',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dispute Case No.
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Text textAlign='center'>
        #D{row.original.number.toString().padStart(4, '0')}
      </Text>
    )
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date Submitted
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Text textAlign='center' pr={5}>
        {format(row.original.createdAt, 'dd MMM yyy')}
      </Text>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <div className='w-[120px]'>
        <p>{row.original.type}</p>
      </div>
    )
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ row }) => (
      <div>
        <a
          href={`/user/disputes/submitted-disputes/view-progress/${row.original.id}`}
          className='text-sm hover:underline text-blue-600'
        >
          {row.original.progress}
        </a>
        <p className='text-xs text-gray-600'>
          Last updated on:{' '}
          {format(row.original.updatedAt, 'dd MMM yyyy, hh:mm a')}
        </p>
      </div>
    )
  }
]
