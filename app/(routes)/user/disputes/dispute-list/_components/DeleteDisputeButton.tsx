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
import { DisputeType } from '@prisma/client'
import { deleteDisputeType } from '@/server/actions/dispute-type'

interface DeleteDisputeButtonProps {
  dispute: DisputeType
  continueDeletion: (confirmed: boolean) => void
}

const DeleteDisputeButton: React.FC<DeleteDisputeButtonProps> = ({
  dispute,
  continueDeletion
}) => {
  const toast = useToast()

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button key={dispute.id} size='xs' mr='10px' colorScheme='red'>
            <DeleteIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete Dispute Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure that you want to delete the dispute type: <br />
              <span className='font-semibold'>{dispute.title}</span>? This
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
                deleteDisputeType(dispute.id).then(data => {
                  if (data.success) {
                    continueDeletion(true)
                    toast({
                      title: `Dispute Type Deleted`,
                      description: `Dispute Type: ${dispute.title}`,
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

export default DeleteDisputeButton
