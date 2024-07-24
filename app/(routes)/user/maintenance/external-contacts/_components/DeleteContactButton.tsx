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
import { ExternalMaintainers } from '@prisma/client'
import { deleteContact } from '@/server/actions/external-contact'

interface DeleteContactButtonProps {
  contact: ExternalMaintainers
  continueDeletion: (confirmed: boolean) => void
}

const DeleteContactButton: React.FC<DeleteContactButtonProps> = ({
  contact,
  continueDeletion
}) => {
  const toast = useToast()

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button key={contact.id} size='xs' mr='10px' colorScheme='red'>
            <DeleteIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete External Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure that you want to delete the external contact:
              <span className='font-semibold'>{contact.name}</span>? This action
              cannot be undone.
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
                deleteContact(contact.id).then(data => {
                  if (data.success) {
                    continueDeletion(true)
                    toast({
                      title: `External Cotnact Deleted`,
                      description: `Contact: ${contact.name}`,
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

export default DeleteContactButton
