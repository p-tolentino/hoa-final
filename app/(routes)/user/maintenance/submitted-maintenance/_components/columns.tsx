'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PersonalInfo } from '@prisma/client'
import { Button, Text } from '@chakra-ui/react'
import { format } from 'date-fns'

export type SubmittedMaintenanceColumn = {
  id: string
  number: number
  status: string
  createdAt: string
  officerAssigned: PersonalInfo | null | undefined
  type: string
  location: string | null | undefined
  description: string
  submittedBy: PersonalInfo | null | undefined
  step: number
  progress: string
  documents: string[]
  priority: string
  letterSent: boolean
  updatedAt: string
  reasonToClose?: string
}

export const columns: ColumnDef<SubmittedMaintenanceColumn>[] = [
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
      <Badge
        className={cn(
          'w-[200px] md:text-xs p-2 ml-3 text-center justify-center break-text',
          row.getValue('status') === 'For Review'
            ? 'bg-yellow-700'
            : row.getValue('status') === 'For Assignment'
            ? 'bg-yellow-800'
            : row.getValue('status') === 'Pending Maintenance Notice'
            ? 'bg-orange-800'
            : row.getValue('status') === 'Maintenance in Progress'
            ? 'bg-blue-900'
            : row.getValue('status') === 'For Final Report'
            ? 'bg-violet-500'
            : row.getValue('status') === 'Closed' &&
              row.original.reasonToClose === 'Cancelled'
            ? ''
            : row.getValue('status') === 'Completed'
            ? 'bg-green-700'
            : row.getValue('status') === 'Closed' &&
              row.original.reasonToClose ===
                ('Insufficient Evidence' || 'Duplicate Submission')
            ? 'bg-red-800'
            : ''
        )}
      >
        {row.getValue('status')}{' '}
        {row.original.reasonToClose && `- ${row.original.reasonToClose}`}
      </Badge>
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
          Ticket No.
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Text textAlign='center'>
        #M{row.original.number.toString().padStart(4, '0')}
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
          Date Requested
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
    id: 'progress',
    header: 'View Progress',
    cell: ({ row }) => (
      <div>
        <a
          href={`/user/maintenance/submitted-maintenance/view-progress/${row.original.id}`}
          className='text-sm hover:underline text-blue-600'
        >
          {row.original.progress}
        </a>
        <p className='text-xs text-gray-500'>
          Last updated on:{' '}
          {format(row.original.updatedAt, 'dd MMM yyyy, hh:mm a')}
        </p>
      </div>
    )
  }
]
