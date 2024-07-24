'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'
import { Facility } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateFacility } from '@/server/actions/facility'
import { Form, FormField } from '@/components/ui/form'
import { EditFacilitySchema } from '@/server/schemas'
import EdtitFileUploadField from './EditFileUploadField'
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
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText
} from '@chakra-ui/react'

interface FacilityProps {
  facility: Facility
}

type FacilityFormValues = z.infer<typeof EditFacilitySchema>

export default function EditFacilityButton ({ facility }: FacilityProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false) // Step 1: Dialog open state
  const [isButtonClicked, setIsButtonClicked] = useState(false)
  const toast = useToast()

  const facilityID = facility.id

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(EditFacilitySchema),
    defaultValues: {
      name: facility.name,
      hourlyRate: facility.hourlyRate.toString(),
      address: facility.address,
      description: facility.description,
      mediaLink: facility.mediaLink || ''
    }
  })

  const onSubmit = async (values: FacilityFormValues) => {
    setIsButtonClicked(true)
    try {
      await updateFacility(values, facilityID) // Call your API to update the facility
      console.log(values) // Replace with actual API call
      form.reset() // Reset form upon success
      setIsOpen(false) // Close dialog upon success
      router.refresh() // Refresh the page or navigate as needed
      toast({
        title: 'Facility Updated',
        description: `Facility: ${values.name}`,
        position: 'bottom-right',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Error Updating Facility',
        description: 'There was an error updating the facility.',
        position: 'bottom-right',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='xs' colorScheme='gray'>
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='overflow-y-auto h-[500px]'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit a Facility</DialogTitle>
              <DialogDescription>
                You may edit the description and image of your selected
                facility.
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
                        value={field.value}
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
              <EdtitFileUploadField />
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
