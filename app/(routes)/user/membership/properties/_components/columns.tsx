'use client'

import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { ArrowUpDown } from 'lucide-react'
import { UserRole } from '@prisma/client'
import { currentUser } from '@/lib/auth'
import { ExtendedUser } from '@/next-auth'
import { format } from 'date-fns'

export type PropertyColumn = {
  id: string
  address: string
  lotNumber: string
  lotSize: string
  purchaseDate: string
  user: ExtendedUser
}

export const columns: ColumnDef<PropertyColumn>[] = [
  {
    accessorKey: 'address',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Address
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='pl-4 w-[max-content]'>{row.getValue('address')}</div>
    )
  },
  {
    accessorKey: 'lotNumber',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Lot Number
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='pr-6 text-center'>{row.getValue('lotNumber')}</div>
    )
  },
  {
    accessorKey: 'lotSize',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Lot Size (in sq. m.)
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='pr-6 text-center'>{row.getValue('lotSize')}</div>
    )
  },
  {
    accessorKey: 'purchaseDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date of Purchase
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className='pl-4'>
        {format(row.getValue('purchaseDate'), 'dd MMM yyyy')}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      row.original.user?.role !== UserRole.USER && (
        <CellAction data={row.original} />
      )
    }
  }
]
