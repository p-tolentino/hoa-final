import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button, useToast } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons' // Import the DeleteIcon
import { MaintenanceType } from '@prisma/client'
import { deleteMaintenanceType } from '@/server/actions/maintenance-type'

interface DeleteMaintenanceButtonProps {
  maintenance: MaintenanceType
  continueDeletion: (confirmed: boolean) => void
}

const DeleteMaintenanceButton: React.FC<DeleteMaintenanceButtonProps> = ({
  maintenance,
  continueDeletion
}) => {
  const toast = useToast()

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button key={maintenance.id} size='xs' mr='10px' colorScheme='red'>
            <DeleteIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Maintenance Service Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure that you want to delete the maintenance service type:{' '}
              <span className='font-semibold'>{maintenance.title}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className='mt-0 hover:bg-gray-100'
              onClick={() => continueDeletion(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-500 hover:bg-red-600'
              onClick={() => {
                deleteMaintenanceType(maintenance.id).then(data => {
                  if (data.success) {
                    continueDeletion(true)
                    toast({
                      title: `Maintenance Service Type Deleted`,
                      description: `Maintenance Service Type: ${maintenance.title}`,
                      status: 'success',
                      position: 'bottom-right',
                      isClosable: true,
                      colorScheme: 'red'
                    })
                  }
                })
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteMaintenanceButton
