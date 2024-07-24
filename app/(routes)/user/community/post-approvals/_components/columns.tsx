'use client'

import { ColumnDef } from '@tanstack/react-table'
import RowActions from './row-actions'
import { Button, Text } from '@chakra-ui/react'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type PendingPostColumn = {
  id: string
  dateSubmitted: string
  submittedBy: string
  title: string
  category: string
  description: string
}

export const columns: ColumnDef<PendingPostColumn>[] = [
  {
    accessorKey: 'dateSubmitted',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date Reported
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Text textAlign='center' pr={10}>
        {row.original.dateSubmitted}
      </Text>
    )
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => (
      <>
        <Badge
          className={cn(
            'w-[150px] h-[min-content] px-3 py-2 text-center justify-center text-xs text-black',
            row.getValue('category') === 'MEETING'
              ? 'bg-purple-200'
              : row.getValue('category') === 'ELECTION'
              ? 'bg-pink-200'
              : row.getValue('category') === 'INQUIRY'
              ? 'bg-blue-200'
              : row.getValue('category') === 'EVENT'
              ? 'bg-orange-200'
              : row.getValue('category') === 'FOODANDDRINK'
              ? 'bg-purple-200'
              : row.getValue('category') === 'CLOTHING'
              ? 'bg-pink-200'
              : row.getValue('category') === 'HOUSEHOLDITEMS'
              ? 'bg-blue-200'
              : row.getValue('category') === 'HOMESERVICES'
              ? 'bg-orange-200'
              : row.getValue('category') === 'OTHER'
              ? 'bg-teal-200'
              : 'bg-gray-200' // Default color if category is not found
          )}
        >
          {row.getValue('category') === 'FOODANDDRINK'
            ? 'FOOD & DRINK'
            : row.getValue('category') === 'HOUSEHOLDITEMS'
            ? 'HOUSEHOLD ITEMS'
            : row.getValue('category') === 'HOMESERVICES'
            ? 'HOME SERVICES'
            : row.getValue('category')}
        </Badge>
      </>
    )
  },
  {
    accessorKey: 'submittedBy',
    header: 'Submitted By',
    cell: ({ row }) => (
      <div className='w-[120px]'>
        <p>{row.original.submittedBy}</p>
      </div>
    )
  },
  {
    accessorKey: 'title',
    header: 'Post Title',
    cell: ({ row }) => (
      <div className='w-[250px]'>
        <p>{row.original.title}</p>
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <RowActions data={row.original} />
    }
  }
]
