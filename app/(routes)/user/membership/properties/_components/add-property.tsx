'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { AddIcon } from '@chakra-ui/icons'
import { Button, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { PropertySchema } from '@/server/schemas'
import { updateProperty } from '@/server/actions/property'
import { useState, useTransition } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type PropertyFormValues = z.infer<typeof PropertySchema>

export const AddProperty = () => {
  const router = useRouter()
  const toast = useToast()
  const { update } = useSession()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(PropertySchema),
    defaultValues: {
      address: undefined,
      lotNumber: undefined,
      lotSize: undefined,
      purchaseDate: undefined,
      latitude: undefined,
      longitude: undefined
    }
  })

  const onSubmit = async (values: PropertyFormValues) => {
    startTransition(() => {
      updateProperty(values, '')
        .then(data => {
          if (data.error) {
            console.log(data.error)
          }

          if (data.success) {
            update()
            toast({
              title: `Committee of Member Updated`,
              description: <div>Property: {values.address}</div>,
              status: 'success',
              position: 'bottom-right',
              isClosable: true
            })
            setOpen(false)
            form.reset()
            router.refresh()
            console.log(data.success)
          }
        })
        .catch(error => {
          throw new Error(error)
        })
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow' leftIcon={<AddIcon />}>
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className='md:min-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add Property</DialogTitle>
          <DialogDescription>
            Fill out the following fields to add a property in the system.
          </DialogDescription>
        </DialogHeader>

        <div className='h-[500px] overflow-y-auto pr-2'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full px-2 space-y-8'
            >
              <div className='grid pt-2 gap-y-2'>
                {/* Complete Property Addresss */}
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem className='mb-5'>
                      <FormLabel>Complete Property Address</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder='(e.g., 123 Street, ABC Subdividion, Lorem City)'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Lot Number */}
                <FormField
                  control={form.control}
                  name='lotNumber'
                  render={({ field }) => (
                    <FormItem className='mb-5'>
                      <FormLabel>Lot Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder='(e.g., Lot 21 Block 14)'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Lot Size */}
                <FormField
                  control={form.control}
                  name='lotSize'
                  render={({ field }) => (
                    <FormItem className='mb-5'>
                      <FormLabel>Lot Size (in square meters)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder='(e.g., 100)'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Purchase Date */}
                <FormField
                  control={form.control}
                  name='purchaseDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Purchase</FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          disabled={isPending}
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Latitude */}
                <FormField
                  control={form.control}
                  name='latitude'
                  render={({ field }) => (
                    <FormItem className='mb-5'>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder='0.00000000'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Longitude */}
                <FormField
                  control={form.control}
                  name='longitude'
                  render={({ field }) => (
                    <FormItem className='mb-5'>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder='0.00000000'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Save Changes */}
              <DialogFooter>
                <Button
                  disabled={isPending}
                  size='sm'
                  colorScheme='yellow'
                  type='submit'
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
