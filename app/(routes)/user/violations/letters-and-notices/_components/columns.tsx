'use client'

import { Button, Stack, Text } from '@chakra-ui/react'
import { Violation, ViolationType } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowUpDown, ArrowUpDownIcon } from 'lucide-react'

export type ViolationLettersAndNoticesColumn = {
  id: string
  type: string
  recipient: string
  meetDate?: string
  venue?: string
  sender: string
  createdAt: string
  violation: Violation
  violationType: ViolationType
}

export const columns: ColumnDef<ViolationLettersAndNoticesColumn>[] = [
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
    accessorKey: 'violationnNumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Violation No.
          <ArrowUpDownIcon className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Text pl='1rem'>
        #V{row.original.violation.number.toString().padStart(4, '0')}
      </Text>
    )
  },
  {
    accessorKey: 'violationType',
    header: 'Violation Type',
    cell: ({ row }) => (
      <div className='w-[200px]'>{row.original?.violationType?.title}</div>
    )
  },
  {
    accessorKey: 'viewViolationLetterNotice',
    header: 'Letter & Notice',
    cell: ({ row }) => (
      <Stack direction='row'>
        <a
          href={`/user/violations/letters-and-notices/letter?letterId=${row.original.id}&violationId=${row.original.violation.id}&violationTypeId=${row.original.violationType.id}`}
          className='hover:underline text-blue-600'
        >
          {`#V${row.original.violation.number.toString().padStart(4, '0')}`}{' '}
          Violation Letter
        </a>
        <span className='text-gray-300'>|</span>
        <a
          href={`/user/violations/letters-and-notices/notice?noticeId=${row.original.id}&violationId=${row.original.violation.id}&violationTypeId=${row.original.violationType.id}`}
          className='hover:underline text-blue-600'
        >
          {`#V${row.original.violation.number.toString().padStart(4, '0')}`}{' '}
          Violation Notice
        </a>
      </Stack>
    )
  }
]
