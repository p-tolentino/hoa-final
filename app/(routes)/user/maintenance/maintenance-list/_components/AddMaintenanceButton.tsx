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
import { createMaintenanceType } from '@/server/actions/maintenance-type'

export const MaintenanceTypeFormSchema = z.object({
  title: z.string(),
  description: z.string()
})

export type MaintenanceTypeFormValues = z.infer<
  typeof MaintenanceTypeFormSchema
>

export default function AddMaintenance () {
  const router = useRouter()

  const form = useForm<MaintenanceTypeFormValues>({
    resolver: zodResolver(MaintenanceTypeFormSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const toast = useToast()

  const onSubmit = async (values: MaintenanceTypeFormValues) => {
    await createMaintenanceType(values)
      .then(data => {
        if (data.success) {
          toast({
            title: `Maintenance Service Type Added`,
            description: `Maintenance Service: ${form.watch('title')}`,
            status: 'success',
            position: 'bottom-right',
            isClosable: true
          })
        }
      })
      .then(() => {
        form.reset()
        router.refresh()
      })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          <AddIcon boxSize={3} mr='10px' />
          Add Maintenance Service Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add a Maintenance Service Type</DialogTitle>
              <DialogDescription>
                Fill up the following fields to add a maintenance service type
                in the list of maintenance services.
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <Stack spacing='15px' my='2rem'>
              {/* Maintenance Title */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Maintenance Service Title:
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

              {/* Maintenance Description */}
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
                  Add Maintenance Service Type
                </Button>
              </FormControl>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
