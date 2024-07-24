'use client'

import { useForm } from 'react-hook-form'
import { AddIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFacility } from '@/server/actions/facility'
import { NewFacilitySchema } from '@/server/schemas'
import * as z from 'zod'
import FileUploadField from './FileUploadField' // Adjust the import path as needed
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
  Button,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast
} from '@chakra-ui/react'
import {
  Form,
  FormControl as ShadControl,
  FormField
} from '@/components/ui/form'

type FacilityFormValues = z.infer<typeof NewFacilitySchema>

function AddNewFacilityButton () {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false) // Step 1: Dialog open state
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const toast = useToast()

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(NewFacilitySchema),
    defaultValues: {
      name: '' || undefined,
      hourlyRate: '' || undefined,
      address: '' || undefined,
      description: '' || undefined,
      media: '' || undefined
    }
  })

  const onSubmit = async (values: FacilityFormValues) => {
    setIsButtonClicked(true)
    try {
      await createFacility(values) // Assume createPost is an async operation
      form.reset() // Reset form upon success
      setIsOpen(false) // Close dialog upon success
      router.refresh() // Refresh the page or navigate as needed
      toast({
        title: 'Facility Added',
        description: `Facility: ${values.name}`,
        position: 'bottom-right',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      window.location.reload()
    } catch (error) {
      console.error('Failed to add new facility:', error)
      // Handle error state here, if needed
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow' leftIcon={<AddIcon />}>
          Add Facility
        </Button>
      </DialogTrigger>
      <DialogContent className='overflow-y-auto h-[500px]'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Facility</DialogTitle>
              <DialogDescription>
                Fill up the following fields to add a facility.
              </DialogDescription>
            </DialogHeader>
            {/* Form Content */}
            <Stack spacing='15px' my='2rem'>
              {/* Facility Name */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Facility Name:
                    </FormLabel>
                    <Input
                      size='md'
                      fontWeight='semibold'
                      type='string'
                      placeholder='Enter a Facility Name'
                      {...field}
                    />
                  </FormControl>
                )}
              />
              <Box py='10px'>
                <Stack spacing='15px'>
                  {/* Hourly Rate */}
                  <FormField
                    control={form.control}
                    name='hourlyRate'
                    render={({ field }) => (
                      <FormControl isRequired>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Hourly Rate of the Facility (in Php):
                        </FormLabel>
                        <NumberInput
                          defaultValue={100}
                          precision={2}
                          step={10}
                          min={0}
                          max={1500}
                          keepWithinRange
                          fontWeight='semibold'
                          onChange={hourlyRate => field.onChange(hourlyRate)}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText fontFamily='font.body' fontSize='xs'>
                          The maximum hourly rate for a facility is ₱1,500.
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </Stack>
              </Box>

              <Box py='10px'>
                <Stack spacing='15px'>
                  {/* Address */}
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormControl isRequired>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Address:
                        </FormLabel>
                        <Input
                          size='md'
                          fontWeight='semibold'
                          type='string'
                          placeholder='Enter a the facility address'
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                </Stack>
              </Box>

              <Box py='10px'>
                <Stack spacing='15px'>
                  {/* Description */}
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormControl isRequired>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Description:
                        </FormLabel>
                        <Textarea
                          placeholder='Write something...'
                          id='facilityDescription'
                          fontSize='sm'
                          resize='none'
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                </Stack>
              </Box>

              <FileUploadField />
            </Stack>

            <DialogFooter>
              <Button
                size='sm'
                colorScheme='yellow'
                type='submit'
                isLoading={isButtonClicked}
                loadingText='Saving'
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default AddNewFacilityButton
