import { FaEllipsis } from 'react-icons/fa6'
import { IconButton } from '@chakra-ui/react'
import { LuCopy as Copy } from 'react-icons/lu'
import { TransactionColumn } from './columns'
import { LuBanknote as Details } from 'react-icons/lu'
import { ViewTransactionDetails } from './view-transaction-details' // Import the ViewTransactionDetails component
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface CellActionProps {
  data: TransactionColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false) // State to manage dialog visibility

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    console.log('Transaction ID copied to the clipboard.')
  }

  const toggleViewDetails = () => {
    setViewDetailsOpen(!viewDetailsOpen) // Toggle dialog visibility
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            aria-label={''}
            icon={<FaEllipsis />}
            color='grey'
            variant='unstyled'
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Copy ID */}
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => onCopy(data.id)}
          >
            <Copy className='w-4 h-4 mr-2' />
            Copy ID
          </DropdownMenuItem>

          {/* View Details */}
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={toggleViewDetails} // Update state to toggle dialog visibility
          >
            <Details className='w-4 h-4 mr-2' />
            View Transaction Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render ViewTransactionDetails dialog if viewDetailsOpen is true */}
      {viewDetailsOpen && (
        <ViewTransactionDetails data={data} onClose={toggleViewDetails} />
      )}
    </>
  )
}
