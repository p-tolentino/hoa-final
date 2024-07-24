'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Button, ButtonGroup, Link, Text } from '@chakra-ui/react'
import RejectApplicationButton from './reject-button'
import ApproveApplicationButton from './approve-button'
import ViewInfo from './view-info'
import { Candidates } from '@prisma/client'

interface Education {
  year: string
  institution: string
}

interface WorkExperience {
  year: string
  company: string
}

export type ElectionApplicationsColumn = {
  id: string
  term: string
  status: string
  applicant: string
  application: Candidates
  educBackground: Education[]
  workExperience: WorkExperience[]
  committee: string
}

export const columns: ColumnDef<ElectionApplicationsColumn>[] = [
  {
    accessorKey: 'term',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Election Term
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <Text pl={3}>{row.original.term}</Text>
  },
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
        {row.getValue('status') !== 'PENDING' ? (
          <Badge
            className={cn(
              'w-[150px] md:text-xs p-2 ml-3 text-center justify-center break-text',
              row.getValue('status') === 'APPROVED'
                ? 'bg-green-700'
                : row.getValue('status') === 'REJECTED'
                ? 'bg-red-800'
                : ''
            )}
          >
            {row.getValue('status')}
          </Badge>
        ) : (
          <Text pl={5} color='lightgray' as='i'>
            {row.getValue('status')}
          </Text>
        )}
      </>
    )
  },
  {
    accessorKey: 'applicant',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Applicant
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <Text pl={5}>{row.original.applicant}</Text>
  },
  {
    id: 'application',
    header: 'Application',
    cell: ({ row }) => <ViewInfo candidateInfo={row.original} />
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div>
        {row.original.status === 'PENDING' &&
          row.original.committee === 'Election Committee' && (
            <ButtonGroup fontFamily='font.body' size='sm'>
              <ApproveApplicationButton application={row.original} />
              <RejectApplicationButton application={row.original} />
            </ButtonGroup>
          )}
      </div>
    )
  }
]
