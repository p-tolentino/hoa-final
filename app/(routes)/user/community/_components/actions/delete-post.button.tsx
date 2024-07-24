import { DeleteIcon } from '@chakra-ui/icons'
import { Button, useToast } from '@chakra-ui/react'
import { deletePost } from '@/server/actions/post'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { AlertModal } from '@/components/modals/alert-modal'

interface DeleteProps {
  postId: string
  postTitle: string
}
export function DeleteButton ({ postId, postTitle }: DeleteProps) {
  const toast = useToast()
  const router = useRouter()
  const [isPending] = useTransition()
  const [open, setOpen] = useState(false)

  const postType = 'Board Discussion'

  const handleDeletePost = async () => {
    try {
      await deletePost(postId)
      setOpen(false)
      router.refresh()

      {
        !isPending &&
          // Display success toast
          toast({
            title: `${postType} Post Deleted`,
            description: `Post: ${postTitle}`,
            status: 'success',
            position: 'bottom-right',
            isClosable: true,
            colorScheme: 'red'
          })
      }
    } catch (error) {
      console.error('Failed to delete post:', error)

      // Display error toast
      toast({
        title: 'Error',
        description: 'Failed to delete discussion post. Please try again.',
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
        onConfirm={() => handleDeletePost()}
        loading={isPending}
        title={`Confirm Delete ${postType} Post`}
        description={
          <>
            Are you sure you want to delete your post:{' '}
            <strong>{postTitle}</strong>? Once you confirm, this post will no
            longer be available to other homeowners.
          </>
        }
        action='Delete'
      />

      <Button
        size='sm'
        fontFamily='font.body'
        colorScheme='red'
        isLoading={isPending}
        loadingText='Deleting'
        leftIcon={<DeleteIcon />}
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
    </>
  )
}
