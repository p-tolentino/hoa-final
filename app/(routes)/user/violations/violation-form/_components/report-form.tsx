'use client'

import { Heading } from '@/components/ui/heading'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadDropzone } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Form, FormField } from '@/components/ui/form'
import { createViolation } from '@/server/actions/violation'
import { PersonalInfo, ViolationType } from '@prisma/client'
import * as z from 'zod'
import BackButton from '@/components/system/BackButton'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Textarea,
  Box,
  Stack,
  HStack,
  Select,
  ButtonGroup,
  IconButton,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react'
import { RiCloseCircleFill } from 'react-icons/ri'

const ViolationFormSchema = z.object({
  violationDate: z.string().refine(date => new Date(date) <= new Date(), {
    message: 'Date issued cannot be in the future'
  }),
  type: z.string(),
  description: z.string()
})

type ViolationFormValues = z.infer<typeof ViolationFormSchema>

interface ReportFormProps {
  violationTypes: ViolationType[]
  users: PersonalInfo[]
}

export const ReportForm: React.FC<ReportFormProps> = ({
  violationTypes,
  users
}) => {
  // Page Title and Description
  const pageTitle = 'Report a Violation'
  const pageDescription =
    "Fill out the Violation Form to formally request a violation review from the Homeowners' Association."

  const currentUser = useCurrentUser()
  const router = useRouter()
  const toast = useToast()

  const [isPending, setIsPending] = useState(false)
  const [personsInvolved, setPersonsInvolved] = useState([''])
  const [filesUploaded, setFilesUploaded] = useState<string[]>([])

  const removePersonInput = (index: number) => {
    const updatedPersonsInvolved = [...personsInvolved]
    updatedPersonsInvolved.splice(index, 1)
    setPersonsInvolved(updatedPersonsInvolved)
  }

  const handlePersonInputChange = (index: number, value: string) => {
    const updatedPersonsInvolved = [...personsInvolved]
    updatedPersonsInvolved[index] = value
    setPersonsInvolved(updatedPersonsInvolved)
  }

  const removeFileUpload = (index: number) => {
    const updatedFilesUploaded = [...filesUploaded]
    updatedFilesUploaded.splice(index, 1)
    setFilesUploaded(updatedFilesUploaded)
  }

  const handleFileUploadChange = (url: string) => {
    setFilesUploaded([...filesUploaded, url])
  }

  const form = useForm<ViolationFormValues>({
    resolver: zodResolver(ViolationFormSchema),
    defaultValues: {
      violationDate: '',
      type: '',
      description: ''
    }
  })

  const onSubmit = async (values: ViolationFormValues) => {
    // Prevent the form from being submitted multiple times
    if (isPending) return

    // Indicate that the form is being processed
    setIsPending(true)

    const formData = {
      ...values,
      violationDate: new Date(values.violationDate),
      personsInvolved: personsInvolved.filter(
        (item, index) => personsInvolved.indexOf(item) === index
      ),
      documents: filesUploaded
    }

    try {
      const data = await createViolation(formData)
      if (data.success) {
        console.log(data.success)
        router.push(
          `/user/violations/submitted-violations/view-progress/${data.violation?.id}`
        )
        toast({
          title: `Violation Form Submitted`,
          description: `Date Submitted: ${new Date().toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: '2-digit'
            }
          )}`,
          status: 'success',
          position: 'bottom-right',
          isClosable: true
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      // Form processing is complete, re-enable the submit button
      setIsPending(false)
    }
  }

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
            <Stack spacing={5}>
              {/* Date of Violation */}
              <FormField
                control={form.control}
                name='violationDate'
                render={({ field, fieldState: { error } }) => (
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel fontSize='md' fontFamily='font.body'>
                      Date of Violation:
                    </FormLabel>
                    <Input
                      type='date'
                      fontSize='sm'
                      fontFamily='font.body'
                      w='max-content'
                      max={new Date().toISOString().split('T')[0]}
                      {...field}
                    />
                    {error && (
                      <FormErrorMessage>{error.message}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />
              {/* Violation Type */}
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='md' fontFamily='font.body'>
                      Violation Type:
                    </FormLabel>
                    <Select
                      size='sm'
                      fontFamily='font.body'
                      w='max-content'
                      onChange={field.onChange}
                      value={field.value}
                    >
                      <option value='' disabled>
                        Select a violation type
                      </option>
                      {violationTypes
                        .slice()
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map(violation => (
                          <option key={violation.id} value={violation.id}>
                            {violation.title}
                          </option>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />
              {/* Violator */}
              <FormControl isRequired>
                <HStack justifyContent='space-between'>
                  <FormLabel fontSize='md' fontFamily='font.body'>
                    Name of Accused Violator
                  </FormLabel>
                </HStack>

                {personsInvolved.map((person, index) => (
                  <Box key={index} display='flex' alignItems='center'>
                    <Select
                      key={index}
                      size='sm'
                      fontFamily='font.body'
                      w='full'
                      onChange={e =>
                        handlePersonInputChange(index, e.target.value)
                      }
                      value={person}
                    >
                      <option value='' disabled>
                        Select from users...
                      </option>
                      {users.map(user => {
                        if (user.userId !== currentUser?.id) {
                          return (
                            <option key={user.userId} value={user.userId}>
                              {user.firstName} {user.lastName}
                            </option>
                          )
                        }
                      })}
                    </Select>

                    {personsInvolved.length > 1 && index !== 0 && (
                      <Button
                        size='xs'
                        colorScheme='red'
                        ml={2}
                        onClick={() => removePersonInput(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>
                ))}
                <FormHelperText fontSize='xs' mt='-1' pt={2}>
                  This will allow us to contact the individual involved in the
                  violation.
                </FormHelperText>
              </FormControl>

              {/* Violation Description */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='md' fontFamily='font.body'>
                      Description:
                    </FormLabel>
                    <Textarea
                      size='sm'
                      placeholder='Tell us what happened...'
                      fontFamily='font.body'
                      resize={'none'}
                      {...field}
                    />
                  </FormControl>
                )}
              />

              {/* Violation Document Uploading */}
              <FormControl>
                <HStack justifyContent='space-between'>
                  <FormLabel fontSize='md' fontFamily='font.body'>
                    Upload your supporting documents:
                  </FormLabel>
                </HStack>
                {filesUploaded.map((file, index) => (
                  <Box
                    key={index}
                    display='flex'
                    alignItems='center'
                    className='mb-2'
                  >
                    <a href={file} className='text-sm' target='_blank'>
                      {file}
                    </a>
                    {/* Render file URL as a link */}
                    {filesUploaded.length > 1 && index !== 0 && (
                      <IconButton
                        aria-label='Remove File'
                        onClick={() => removeFileUpload(index)}
                        icon={<RiCloseCircleFill color='red' />}
                        bg='none'
                        p={0}
                        boxSize='14px'
                        _hover={{ bg: 'none' }}
                      />
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
                <FormHelperText fontSize='xs' fontFamily='font.body'>
                  This will allow us to gain more information about the
                  violation that would help us in decision making.
                </FormHelperText>
              </FormControl>

              {/* Submit Button */}
              <Box textAlign='center'>
                <Button
                  size='sm'
                  type='submit'
                  colorScheme='yellow'
                  my='20px'
                  isLoading={isPending} // Chakra UI's Button has an isLoading prop for this purpose
                  loadingText='Submitting...' // Optional: text to display when loading
                >
                  Submit Violation Form
                </Button>
              </Box>
            </Stack>
          </form>
        </Form>
      </Box>
    </>
  )
}

export default ReportForm
