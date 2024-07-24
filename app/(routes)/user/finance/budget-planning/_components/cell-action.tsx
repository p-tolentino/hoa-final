import { BudgetPlan } from '@prisma/client'

import { FaEllipsis } from 'react-icons/fa6'
import { DeleteIcon } from '@chakra-ui/icons'
import { AlertModal } from '@/components/modals/alert-modal'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LuCopy as Copy } from 'react-icons/lu'
import { deleteBudgetPlan } from '@/server/actions/budget-plan'
import { IconButton, useToast } from '@chakra-ui/react'
import React, { useState, useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { BudgetPlanColumn } from './columns'
import { useRouter } from 'next/navigation'

interface CellActionProps {
  data: BudgetPlanColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const user = useCurrentUser()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const selectedPlan = data.title

  const toast = useToast()

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    console.log('Budget Plan ID copied to the clipboard.')
  }

  const handleDelete = async (planId: string) => {
    try {
      await deleteBudgetPlan(planId).then(() => {
        console.log(`Successfully deleted budget plan with ID: ${planId}`)

        // Show success toast
        toast({
          title: 'Budget Plan Deleted',
          description: `Budget Plan: ${selectedPlan}`,
          status: 'success',
          colorScheme: 'red',
          isClosable: true,
          position: 'bottom-right'
        })
        setOpen(false)
        router.refresh()
      })
    } catch (error) {
      console.error(`Failed to delete plan with ID: ${planId}`)
      // Optionally, you could also show an error toast here
      toast({
        title: 'Error',
        description: 'Failed to delete the budget plan. Please try again.',
        status: 'error',
        colorScheme: 'red',
        isClosable: true,
        position: 'bottom-right'
      })
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleDelete(data.id)}
        loading={isPending}
        title='Confirm  Delete Budget Plan'
        action='Delete'
        description={
          <>
            Are you sure you want to delete the <strong>{data.title}</strong>{' '}
            from the system? This action cannot be undone.
          </>
        }
      />

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

          {/* Delete */}
          {(user?.info?.position === 'Admin' ||
            user?.info?.position === 'Superuser' ||
            user?.info?.position === 'Treasurer') && (
            <DropdownMenuItem
              className='font-semibold text-red-500 cursor-pointer'
              onClick={() => setOpen(true)}
            >
              <div className='font-semibold text-red-500'>
                <DeleteIcon mr={2} />
                Delete
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
