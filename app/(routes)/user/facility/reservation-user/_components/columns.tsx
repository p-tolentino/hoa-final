'use client'

import { Button } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { ArrowUpDown } from 'lucide-react'
import {
  Hoa,
  FacilityReservation,
  MaintenanceSchedule,
  MaintenanceNotice
} from '@prisma/client'
import { PersonalInfo } from '@prisma/client'

export type ReservationsMadeColumn = {
  reservationId: string
  userName: string
  facility: string | null | undefined
  numHours: string
  startTime: string
  endTime: string
  reservationFee: number
  start: Date
  end: Date
  hourlyRate: number | null | undefined
  cancelPeriod: number
  cancelFee: number
  reservedBy: PersonalInfo | null | undefined
  facilityReservations: FacilityReservation[]
  maintenanceSchedule: MaintenanceSchedule[]
  maintenanceNotice: MaintenanceNotice[]
} | null

const formatNumber = (value: number) => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export const columns = (hoaInfo: Hoa): ColumnDef<ReservationsMadeColumn>[] => [
  {
    accessorKey: 'facility',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Facility
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-4'>{row.original?.facility}</div>
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start Date and Time
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-4'>{row.original?.startTime}</div>
  },
  {
    accessorKey: 'endTime',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          End Date and Time
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-4'>{row.original?.endTime}</div>
  },
  {
    accessorKey: 'reservationFee',
    header: ({ column }) => {
      return (
        <div className='flex justify-end w-[120px]'>
          <Button
            size='sm'
            variant='ghost'
            className='hover:bg-[#ffe492]'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Reservation Fee
            <ArrowUpDown className='w-4 h-4 ml-2' />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => (
      <div className='flex justify-end w-[120px] pr-4'>
        ₱ {formatNumber(parseFloat(`${row.original?.reservationFee}`))}
      </div>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      row.original?.start && new Date(row.original.start) >= new Date() ? (
        <CellAction data={row.original} hoaInfo={hoaInfo} />
      ) : (
        <span className='text-gray-200 italic'>Closed</span>
      )
  }
]
