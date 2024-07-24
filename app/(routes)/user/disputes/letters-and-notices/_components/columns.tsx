'use client'

import { Button, Text } from '@chakra-ui/react'
import { Dispute, DisputeType } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, ArrowUpDownIcon } from 'lucide-react'

export type DisputeLettersAndNoticesColumn = {
  id: string
  type: string
  recipient: string
  meetDate?: string
  meetTime?: string
  venue?: string
  sender: string
  createdAt: string
  dispute: Dispute
  disputeType: DisputeType
}

export const columns: ColumnDef<DisputeLettersAndNoticesColumn>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date Received
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Text pl='1rem'>{format(row.original.createdAt, 'dd MMM yyyy')}</Text>
    )
  },
  {
    accessorKey: 'disputeNumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dispute No.
          <ArrowUpDownIcon className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Text pl='1rem'>
        #D{row.original.dispute.number.toString().padStart(4, '0')}
      </Text>
    )
  },
  {
    accessorKey: 'disputeType',
    header: 'Dispute Type',
    cell: ({ row }) => (
      <div className='w-[200px]'>{row.original.disputeType.title}</div>
    )
  },
  {
    accessorKey: 'viewDisputeLetterNotice',
    header: 'Letter',
    cell: ({ row }) => (
      <a
        href={`/user/disputes/letters-and-notices/letter?letterId=${row.original.id}&disputeId=${row.original.dispute.id}`}
        className='hover:underline text-blue-600'
      >
        {`#D${row.original.dispute.number.toString().padStart(4, '0')}`} Dispute
        Resolution Meeting Letter
      </a>
    )
  }
]
