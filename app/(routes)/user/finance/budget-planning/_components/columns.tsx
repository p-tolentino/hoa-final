'use client'

import { ColumnDef } from '@tanstack/react-table'
import { BudgetPlan } from '@prisma/client'
import { CellAction } from './cell-action'
import { ArrowUpDown } from 'lucide-react'
import { Button, Text } from '@chakra-ui/react'
import Link from 'next/link'

export type BudgetPlanColumn = {
  id: string
  title: string
  forYear: string
}

export const columns: ColumnDef<BudgetPlanColumn>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Budget Plan Title
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <Text pl={4}>{row.original.title}</Text>
  },
  {
    accessorKey: 'forYear',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492] font-semibold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Buget Plan for the Year
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <Text pl={4}>{row.original.forYear}</Text>
  },
  {
    accessorKey: 'viewBudgetPlan',
    header: '',
    cell: ({ row }) => (
      <Button
        as={Link}
        href={`/user/finance/budget-planning/${row.original.id}`}
        fontFamily='font.body'
        colorScheme='green'
        variant='ghost'
        size='sm'
      >
        View Detailed Budget Plan
      </Button>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
