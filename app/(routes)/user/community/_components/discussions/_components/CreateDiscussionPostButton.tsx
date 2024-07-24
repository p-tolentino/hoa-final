'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Input,
  Stack,
  Box,
  Divider,
  Radio,
  RadioGroup,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast
} from '@chakra-ui/react'

import {
  Form,
  FormControl as ShadControl,
  FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage
} from '@/components/ui/form'

import { AddIcon } from '@chakra-ui/icons'
import { useState, useTransition } from 'react'
import { NewPostSchema } from '@/server/schemas'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPost } from '@/server/actions/post'
import { useRouter } from 'next/navigation'
import FileUploadField from '../../actions/file-upload-field' // Adjust the import path as needed

type PostFormValues = z.infer<typeof NewPostSchema>

function CreateDiscussionPostButton () {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false) // Step 1: Dialog open state
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const toast = useToast()

  const form = useForm<PostFormValues>({
    resolver: zodResolver(NewPostSchema),
    defaultValues: {
      type: 'DISCUSSION' || undefined,
      title: '' || undefined,
      category: '' || undefined,
      description: '' || undefined,
      media: '' || undefined
    }
  })

  const onSubmit = async (values: PostFormValues) => {
    setIsButtonClicked(true)
    try {
      await createPost(values) // Assume createPost is an async operation
      form.reset() // Reset form upon success
      setIsOpen(false) // Close dialog upon success
      toast({
        title: `Discussion Post Created`,
        description: `Post: ${values.title}`,
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      })
      router.refresh() // Refresh the page or navigate as needed
    } catch (error) {
      console.error('Failed to create post:', error)
      // Handle error state here, if needed
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          <AddIcon boxSize={3} mr='10px' />
          Create Discussion Post
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[500px] overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Discussion Post</DialogTitle>
              <DialogDescription>
                Fill up the following fields to create a discussion post.
              </DialogDescription>
            </DialogHeader>
            {/* Form Content */}
            <Stack spacing='15px' my='1rem'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Discussion Title:
                    </FormLabel>
                    <Input
                      size='md'
                      fontWeight='semibold'
                      type='string'
                      {...field}
                      placeholder='Enter a Discussion Title'
                    />
                  </FormControl>
                )}
              />

              {/* Select Category */}
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Category:
                    </FormLabel>
                    <RadioGroup
                      defaultValue=''
                      size='sm'
                      colorScheme='yellow'
                      value={field.value || ''}
                      onChange={field.onChange}
                    >
                      <Stack spacing={5} direction='row' fontFamily='font.body'>
                        <Radio value='MEETING'>Meeting</Radio>
                        <Radio value='ELECTION'>Election</Radio>
                        <Radio value='INQUIRY'>Inquiry</Radio>
                        <Radio value='EVENT'>Event</Radio>
                        <Radio value='OTHER'>Other</Radio>
                      </Stack>
                    </RadioGroup>
                    <FormHelperText fontSize='xs' mt={3}>
                      Select the category that applies to your post for members
                      to easily find it.
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Divider />
              <Box py='10px'>
                <Stack spacing='15px'>
                  {/* Post Content */}
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormControl isRequired>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Your Post
                        </FormLabel>
                        <Textarea
                          placeholder='Write something...'
                          fontSize='xs'
                          resize='none'
                          h='100px'
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                </Stack>
              </Box>

              <FileUploadField isOptional={true} />
            </Stack>
            <DialogFooter>
              <Button
                size='sm'
                colorScheme='yellow'
                type='submit'
                isLoading={isButtonClicked}
                loadingText='Submitting'
              >
                Submit Post for Approval
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default CreateDiscussionPostButton
