'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { PersonalInfo } from '@prisma/client'
import { Button, ButtonGroup, Text } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import ManageElectionButton from './manage-button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'

export type ElectionRecordColumn = {
  electionId: string
  termOfOffice: string | null
  period: string
  requiredVotes: number
  voterTurnout: number
  activeUsers?: number
  status: string
  committee: string
  endDate: Date
}

export const columns: ColumnDef<ElectionRecordColumn>[] = [
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
    cell: ({ row }) => (
      <Badge
        className={cn(
          'w-[100px] md:text-xs p-2 ml-3 text-center justify-center break-text',
          {
            'bg-green-700': row.getValue('status') === 'ON-GOING',
            'bg-red-700': row.getValue('status') === 'CLOSED'
          }
        )}
      >
        {row.getValue('status')}
      </Badge>
    )
  },
  {
    accessorKey: 'termOfOffice',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Election Term
          <br />
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <Text pl={3}>{row.original.termOfOffice}</Text>
  },
  {
    accessorKey: 'period',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Election Period
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const [startDate, endDate] = row.original.period.split(' - ')

      const formattedStartDate = format(new Date(startDate), 'dd MMM yyyy')
      const formattedEndDate = format(new Date(endDate), 'dd MMM yyyy')
      return (
        <Text pl={3}>
          Start: {formattedStartDate}
          <br />
          End: {formattedEndDate}
        </Text>
      )
    }
  },
  {
    accessorKey: 'voterTurnout',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Voter Turnout
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      // RULE: If voter turnout is equal to greater than (50% + 1) count, color must be green
      // COMPUTATION should be: (0.5 x totalNumOfVoters) + 1 is the baseline for an election to be valid
      <Text
        pl={10}
        color={
          row.original.voterTurnout < row.original.requiredVotes
            ? 'red'
            : 'green'
        }
      >
        {row.original.voterTurnout < row.original.requiredVotes ? (
          <TriangleDownIcon />
        ) : (
          <TriangleUpIcon />
        )}{' '}
        <span className='font-semibold'>
          {row.original.voterTurnout} / {row.original.requiredVotes}
        </span>
      </Text>
    )
  },

  {
    id: 'report',
    // header: 'View Report',
    cell: ({ row }) => (
      <div>
        <ButtonGroup>
          <Button
            variant='link'
            size='sm'
            color='blue.500'
            fontFamily='font.body'
            as={Link}
            href={`/user/election/election-report/${row.original.electionId}`}
          >
            {row.original.termOfOffice} Election Report
          </Button>
        </ButtonGroup>
      </div>
    )
  },
  {
    id: 'actions',
    // header: 'Actions',
    cell: ({ row }) => (
      <div className='mr-3'>
        {row.original.status !== 'CLOSED' &&
          row.original.committee === 'Election Committee' && (
            <ManageElectionButton election={row.original} />
          )}
      </div>
    )
  }
]
