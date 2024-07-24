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
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  FormHelperText
} from '@chakra-ui/react'

import { AddIcon } from '@chakra-ui/icons'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { createDisputeType } from '@/server/actions/dispute-type'
import { useState } from 'react'

export const DisputeTypeFormSchema = z.object({
  title: z.string(),
  description: z.string()
})

export type DisputeTypeFormValues = z.infer<typeof DisputeTypeFormSchema>

export default function AddDispute () {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const form = useForm<DisputeTypeFormValues>({
    resolver: zodResolver(DisputeTypeFormSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const onSubmit = async (values: DisputeTypeFormValues) => {
    await createDisputeType(values)
      .then(data => {
        if (data.success) {
          toast({
            title: `Dispute Type Added`,
            description: `Dispute Type: ${form.watch('title')}`,
            status: 'success',
            position: 'bottom-right',
            isClosable: true
          })
        }
      })
      .then(() => {
        form.reset()
        router.refresh()
        setIsOpen(false)
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          <AddIcon boxSize={3} mr='10px' />
          Add Dispute Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add a Dispute Type</DialogTitle>
              <DialogDescription>
                Fill out the following fields to add a dispute type.
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <Stack spacing='15px' my='2rem'>
              {/* Dispute Title */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Dispute Title:
                    </FormLabel>
                    <Input
                      size='md'
                      fontWeight='semibold'
                      type='string'
                      placeholder='Enter a Title'
                      {...field}
                    />
                  </FormControl>
                )}
              />

              {/* Dispute Description */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Description:
                    </FormLabel>
                    <Textarea
                      fontFamily='font.body'
                      placeholder='Write something...'
                      fontSize='sm'
                      resize='none'
                      {...field}
                    />
                  </FormControl>
                )}
              />
            </Stack>

            <DialogFooter className='text-right'>
              <FormControl>
                <Button size='sm' colorScheme='yellow' type='submit'>
                  Save Changes
                </Button>
              </FormControl>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
