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

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const columns = (hoaInfo: Hoa): ColumnDef<ReservationsMadeColumn>[] => [
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         size="sm"
  //         variant="ghost"
  //         className="hover:bg-[#ffe492]"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Status
  //         <ArrowUpDown className="w-4 h-4 ml-2" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <Badge
  //       className={cn(
  //         "w-[100px] md:text-xs p-2 ml-3 text-center justify-center break-text",
  //         row.getValue("status") === "Reserved"
  //           ? "bg-yellow-700"
  //           : row.getValue("status") === "Cancelled"
  //           ? "bg-red-500"
  //           : row.getValue("status") === "Completed"
  //           ? "bg-green-700"
  //           : "display-none"
  //       )}
  //     >
  //       <div>{row.getValue("status")} </div>
  //     </Badge>
  //   ),
  // },
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
        {row.original?.reservationFee &&
          formatCurrency(row.original?.reservationFee)}
      </div>
    )
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => {
      return (
        <Button
          size='sm'
          variant='ghost'
          className='hover:bg-[#ffe492]'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Reserved By
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='pl-4'>{row.original?.userName}</div>
  },
  // {
  //   id: 'actions',
  //   header: '',
  //   cell: ({ row }) =>
  //     row.original?.end!! >= new Date() && (
  //       <CancelReservationButton id={row.original?.reservationId} />
  //     )
  // }
  {
    id: 'actions',
    cell: ({ row }) =>
      row.original?.end && new Date(row.original.end) >= new Date() ? (
        <CellAction data={row.original} hoaInfo={hoaInfo} />
      ) : (
        <span className='text-gray-200 italic'>Closed</span>
      )
  }
]
