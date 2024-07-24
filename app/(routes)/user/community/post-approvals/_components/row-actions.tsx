import React, { useState } from 'react'
import { Box, Button, Flex, Stack, Text, useToast } from '@chakra-ui/react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { PendingPostColumn } from './columns' // Assuming this is the correct import path
import { updatePostStatus, declinePost } from '@/server/actions/post'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface RowActionProps {
  data: PendingPostColumn
}

const RowActions: React.FC<RowActionProps> = ({ data }) => {
  // Example usage of data within the component. Adjust according to your needs.
  const toast = useToast() // Using Chakra UI's useToast for feedback
  const router = useRouter()
  const handleApprove = async () => {
    try {
      const response = await updatePostStatus(data.id) // Assuming updatePostStatus now also takes a status argument
      if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          status: 'error',
          position: 'bottom-right',
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: 'Post Approved',
          description: (
            <>
              <div>Post: {data.title}</div>
              <div>Submitted by: {data.submittedBy}</div>
            </>
          ),
          status: 'success',
          position: 'bottom-right',
          duration: 5000,
          isClosable: true
        })
        router.refresh()
        // Optionally, refresh the data or navigate as needed
      }
    } catch (error) {
      console.error('Failed to approve post:', error)
      // Handle error appropriately
    }
  }

  const handleDecline = async () => {
    try {
      const response = await declinePost(data.id) // Assuming updatePostStatus now also takes a status argument
      if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          status: 'error',
          position: 'bottom-right',
          duration: 5000,
          isClosable: true,
          colorScheme: 'green'
        })
      } else {
        toast({
          title: 'Post Declined',
          description: (
            <>
              <div>Post: {data.title}</div>
              <div>Submitted by: {data.submittedBy}</div>
            </>
          ),
          status: 'success',
          position: 'bottom-right',
          duration: 5000,
          isClosable: true,
          colorScheme: 'red'
        })
        router.refresh()
        // Optionally, refresh the data or navigate as needed
      }
    } catch (error) {
      console.error('Failed to approve post:', error)
      // Handle error appropriately
    }
  }

  return (
    <Flex gap={2}>
      {/* View Post */}
      <Dialog>
        <DialogTrigger>
          <a className='text-sm hover:underline text-blue-600 mr-10'>
            View Post
          </a>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
            <DialogDescription>Post ID: {data.id}</DialogDescription>
          </DialogHeader>

          <Stack spacing={5} fontFamily='font.body' mb={5}>
            <Stack spacing={2}>
              <Stack gap={0}>
                {/* Category */}
                <Badge
                  className={cn(
                    'w-[max-content] text-xs py-1 px-3 p text-center justify-center break-text text-black',
                    data.category === 'MEETING'
                      ? 'bg-purple-200'
                      : data.category === 'ELECTION'
                      ? 'bg-pink-200'
                      : data.category === 'INQUIRY'
                      ? 'bg-blue-200'
                      : data.category === 'EVENT'
                      ? 'bg-orange-200'
                      : data.category === 'FOODANDDRINK'
                      ? 'bg-purple-200'
                      : data.category === 'CLOTHING'
                      ? 'bg-pink-200'
                      : data.category === 'HOUSEHOLDITEMS'
                      ? 'bg-blue-200'
                      : data.category === 'HOMESERVICES'
                      ? 'bg-orange-200'
                      : data.category === 'OTHER'
                      ? 'bg-teal-200'
                      : 'bg-gray-200' // Default color if category is not found
                  )}
                >
                  {data.category === 'FOODANDDRINK'
                    ? 'FOOD & DRINK'
                    : data.category === 'HOUSEHOLDITEMS'
                    ? 'HOUSEHOLD ITEMS'
                    : data.category === 'HOMESERVICES'
                    ? 'HOME SERVICES'
                    : data.category}
                </Badge>
                {/* Title */}
                <Text fontWeight='bold' fontSize='lg' ml={1.5}>
                  {data.title}
                </Text>
              </Stack>
            </Stack>
            <Flex gap={10}>
              {/* Posted by */}
              <Box>
                <Text fontWeight='semibold'>Posted by:</Text>
                <Text>{data.submittedBy}</Text>
              </Box>
              {/* Date Submitted */}
              <Box>
                <Text fontWeight='semibold'>Date Submitted:</Text>
                <Text>{data.dateSubmitted}</Text>
              </Box>
            </Flex>

            {/* Description */}
            <Box>
              <Text fontWeight='semibold'>Description:</Text>
              <Text
                textAlign='justify'
                overflowY='auto'
                maxH='100px'
                fontSize='sm'
                p={3}
              >
                {data.description}
              </Text>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
      {/* Approve Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size='sm' colorScheme='green' fontFamily='font.body'>
            Approve
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Request to Post</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className='text-justify'>
            Are you sure you want to approve the post:{' '}
            <strong>{data.title}</strong> submitted by{' '}
            <strong>{data.submittedBy}</strong>? This will allow the post to be
            viewed in the Community Engagement module.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className='mt-0 hover:bg-gray-100'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-green-500 hover:bg-green-600'
              onClick={handleApprove}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size='sm' colorScheme='red' fontFamily='font.body'>
            Decline
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Request to Post</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className='text-justify'>
            Are you sure you want to decline the post:{' '}
            <strong>{data.title}</strong> submitted by{' '}
            <strong>{data.submittedBy}</strong>? This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className='mt-0 hover:bg-gray-100'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-500 hover:bg-red-600'
              onClick={handleDecline}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  )
}

export default RowActions
