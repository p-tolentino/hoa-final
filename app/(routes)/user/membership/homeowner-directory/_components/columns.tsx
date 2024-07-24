'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Status } from '@prisma/client'
import { ViewInfo } from './view-info'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { ArrowUpDown } from 'lucide-react'

export type HomeownerColumn = {
  id: string
  name: string
  email: string
  status: string
  type: string
  position: string
  committee: string
  phoneNumber: string
  birthDay: string
  address: string
  govtId: string
  role: string
  bio: string
  image: string
}

export const columns: ColumnDef<HomeownerColumn>[] = [
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
          row.getValue('status') === Status.ACTIVE
            ? 'bg-green-700'
            : row.getValue('status') === Status.INACTIVE || Status.DELINQUENT
            ? 'bg-red-700'
            : row.getValue('status') === Status.PENDING
            ? 'bg-yellow-600'
            : 'display-none'
        )}
      >
        {' '}
        {row.getValue('status')}
      </Badge>
    )
  },
  {
    accessorKey: 'position',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Position
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-4'>{row.getValue('position')}</div>
  },
  {
    accessorKey: 'committee',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Committee
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div
        className={`pl-4 ${
          row.getValue('committee') === '' ? 'text-gray-300 italic' : ''
        }`}
      >
        {row.getValue('committee') ? row.getValue('committee') : 'N/A'}
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='capitalize pl-4'>{row.getValue('name')}</div>
    )
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-4'>{row.getValue('email')}</div>
  },

  {
    id: 'Member Information',
    cell: ({ row }) => <ViewInfo data={row.original} />
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
