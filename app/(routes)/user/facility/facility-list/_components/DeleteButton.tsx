import { Facility } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alert-modal'
import { DeleteIcon } from '@chakra-ui/icons'
import { deleteFacility } from '@/server/actions/facility'
import { IconButton, useToast } from '@chakra-ui/react'
import { useState, useTransition } from 'react'

interface FacilityProps {
  facility: Facility
}

export function DeleteButton ({ facility }: FacilityProps) {
  const toast = useToast() // Initialize toast
  const [isPending] = useTransition()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleDeleteFacility = async (facilityId: string) => {
    try {
      await deleteFacility(facilityId)
      setOpen(false)
      router.refresh()

      // Display success toast
      toast({
        title: 'Facility Deleted',
        description: `Facility: ${facility.name}`,
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
        colorScheme: 'red'
      })
    } catch (error) {
      console.error('Failed to delete post:', error)

      // Display error toast
      toast({
        title: 'Error',
        description: 'Failed to delete facility. Please try again.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
        colorScheme: 'gray'
      })
    }
  }
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => handleDeleteFacility(facility.id)}
        loading={isPending}
        title='Confirm Facility Deletion'
        description={
          <>
            Are you sure you want to delete the <strong>{facility.name}</strong>{' '}
            from the system? This action cannot be undone.
          </>
        }
        action='Deleting'
      />

      <IconButton
        aria-label='Delete'
        icon={<DeleteIcon />}
        size='xs'
        colorScheme='red'
        onClick={() => setOpen(true)}
      ></IconButton>
    </>
  )
}
