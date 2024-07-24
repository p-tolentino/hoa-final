'use client'

import { Heading } from '@/components/ui/heading'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'
import { UploadDropzone } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/use-current-user'
import { createMaintenanceRequest } from '@/server/actions/maintenance-request'
import { Facility, MaintenanceType, Property } from '@prisma/client'
import * as z from 'zod'
import BackButton from '@/components/system/BackButton'
import {
  Select,
  Button,
  Box,
  Stack,
  FormControl,
  Textarea,
  FormLabel,
  FormHelperText,
  Flex,
  ButtonGroup
} from '@chakra-ui/react'

const RequestFormSchema = z.object({
  // requestDate: z.string().refine((date) => new Date(date) <= new Date(), {
  //   message: "Date issued cannot be in the future",
  // }),
  type: z.string(),
  location: z.string(),
  description: z.string()
})

type RequestFormValues = z.infer<typeof RequestFormSchema>

interface RequestFormProps {
  serviceTypes: MaintenanceType[]
  facilities: Facility[]
  locations: Property[]
}
export const RequestForm: React.FC<RequestFormProps> = ({
  serviceTypes,
  facilities,
  locations
}) => {
  const user = useCurrentUser()
  const router = useRouter()

  const [filesUploaded, setFilesUploaded] = useState<string[]>([])
  const [isPending, setIsPending] = useState(false)

  const removeFileUpload = (index: number) => {
    const updatedFilesUploaded = [...filesUploaded]
    updatedFilesUploaded.splice(index, 1)
    setFilesUploaded(updatedFilesUploaded)
  }

  const handleFileUploadChange = (url: string) => {
    setFilesUploaded([...filesUploaded, url])
  }

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(RequestFormSchema),
    defaultValues: {
      type: '',
      location: '',
      description: ''
    }
  })

  const onSubmit = async (values: RequestFormValues) => {
    // Prevent the form from being submitted multiple times
    if (isPending) return

    // Indicate that the form is being processed
    setIsPending(true)

    const formData = {
      ...values,
      documents: filesUploaded.filter(file => file.trim() !== '') // Exclude empty strings
    }

    try {
      const data = await createMaintenanceRequest(formData)
      if (data.success) {
        console.log(data.success)
        router.push(
          `/user/maintenance/submitted-maintenance/view-progress/${data.maintenance.id}`
        )
      }
    } catch (error) {
      console.error(error)
    } finally {
      // Form processing is complete, re-enable the submit button
      setIsPending(false)
    }
  }

  // Page Title and Description
  const pageTitle = `Maintenance Request Form`
  const pageDescription = `Request a maintenance service within the Homeowners Association.`

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <Box w='80%'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack spacing={8}>
              <Flex gap={5}>
                {/* Select Maintenance Service Type */}
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontSize='sm' fontWeight='semibold'>
                        Select Maintenance Service Type:
                      </FormLabel>
                      <Select
                        fontFamily='font.body'
                        size='sm'
                        onChange={field.onChange}
                        value={field.value}
                      >
                        <option value='' disabled>
                          Select a Maintenance Service Type
                        </option>
                        {serviceTypes.map(type => (
                          <option value={type.id} key={type.id}>
                            {type.title}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {/* Select Facility when Facility Maintenance is selected */}
                {/* Select Location when Facility Maintenance is NOT selected */}
                {form.watch('type') === 'facilityMaintenance' ? (
                  <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                      <FormControl
                        display={
                          form.watch('type') === 'facilityMaintenance'
                            ? 'visible'
                            : 'none'
                        }
                        isRequired={
                          form.watch('type') === 'facilityMaintenance'
                        }
                      >
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Select a Facility:
                        </FormLabel>
                        <Select
                          fontFamily='font.body'
                          placeholder='Select facility'
                          size='sm'
                          onChange={field.onChange}
                          value={field.value}
                          disabled={form.watch('type') === ''}
                        >
                          {facilities?.map(facility => (
                            <option key={facility.id} value={facility.id}>
                              {facility.name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                      <FormControl
                        display={
                          form.watch('type') !== 'facilityMaintenance'
                            ? 'visible'
                            : 'none'
                        }
                        isRequired={
                          form.watch('type') !== 'facilityMaintenance'
                        }
                      >
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Select a location:
                        </FormLabel>
                        <Select
                          fontFamily='font.body'
                          placeholder={
                            form.watch('type') === ''
                              ? 'Select a maintenance type first...'
                              : 'Select location'
                          }
                          size='sm'
                          onChange={field.onChange}
                          value={field.value}
                          disabled={form.watch('type') === ''}
                        >
                          {locations?.map(loc => (
                            <option key={loc.id} value={loc.id}>
                              {loc.address}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                )}
              </Flex>
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
                      fontFamily='font.body'
                      size='sm'
                      resize='none'
                      placeholder='Tell us what you observed...'
                      {...field}
                    />
                  </FormControl>
                )}
              />
              {/* Upload Media (Optional) */}
              <FormControl>
                <FormLabel fontSize='md' fontFamily='font.body'>
                  Upload Media (Optional):
                </FormLabel>
                {filesUploaded.map((file, index) => (
                  <Box
                    key={index}
                    display='flex'
                    alignItems='center'
                    className='mb-2'
                  >
                    <a href={file} target='_blank'>
                      {file}
                    </a>{' '}
                    {/* Render file URL as a link */}
                    {filesUploaded.length > 1 && index !== 0 && (
                      <Button
                        size='xs'
                        colorScheme='red'
                        ml={2}
                        onClick={() => removeFileUpload(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                ))}
                <UploadDropzone
                  appearance={{
                    button:
                      'ut-uploading:cursor-not-allowed rounded-r-none bg-[#e6c45e] text-black bg-none after:bg-[#dbac1d]',
                    label: { color: '#ffaa00' },
                    uploadIcon: { color: '#355E3B' }
                  }}
                  endpoint='mixedUploader' // Adjust this endpoint as needed
                  onClientUploadComplete={res =>
                    handleFileUploadChange(res[0].url)
                  }
                  onUploadError={error => console.log(error)}
                />
                <FormHelperText fontSize='xs' mt='-1' pt={2}>
                  This will provide us with further information about the area
                  needed for maintenance.
                </FormHelperText>
              </FormControl>
              {/* Submit Maintenance Request */}
              <Box mt={5} textAlign='center'>
                <FormControl>
                  <Button
                    size='sm'
                    type='submit'
                    colorScheme='yellow'
                    isLoading={isPending} // Disable the button and show loading indicator when isPending is true
                    loadingText='Submitting' // Text to display during loading
                  >
                    Submit Maintenance Request Form
                  </Button>
                </FormControl>
              </Box>
            </Stack>
          </form>
        </Form>
      </Box>
    </>
  )
}

export default RequestForm
