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
import { ViolationType } from '@prisma/client'
import { deleteViolationType } from '@/server/actions/violation-type'

interface DeleteViolationButtonProps {
  violation: ViolationType
  continueDeletion: (confirmed: boolean) => void
}

const DeleteViolationButton: React.FC<DeleteViolationButtonProps> = ({
  violation,
  continueDeletion
}) => {
  const toast = useToast()

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button key={violation.id} size='xs' mr='10px' colorScheme='red'>
            <DeleteIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete Violation Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure that you want to delete the violation type: <br />
              <span className='font-semibold'>{violation.title}</span>? This
              action cannot be undone.
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
                deleteViolationType(violation.id).then(data => {
                  if (data.success) {
                    continueDeletion(true)
                    toast({
                      title: `Violation Type Deleted`,
                      description: `Violation Type: ${violation.title}`,
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

export default DeleteViolationButton
