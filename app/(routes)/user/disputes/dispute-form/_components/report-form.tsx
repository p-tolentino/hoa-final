'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Heading } from '@/components/ui/heading'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDispute } from '@/server/actions/dispute'
import { useCurrentUser } from '@/hooks/use-current-user'
import { UploadDropzone } from '@/lib/utils'
import { Form, FormField } from '@/components/ui/form'
import { DisputeType, PersonalInfo } from '@prisma/client'
import BackButton from '@/components/system/BackButton'
import * as z from 'zod'
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Textarea,
  Box,
  Stack,
  Select,
  HStack,
  ButtonGroup,
  FormErrorMessage,
  useToast,
  IconButton
} from '@chakra-ui/react'
import { RiCloseCircleFill } from 'react-icons/ri'

const DisputeFormSchema = z.object({
  disputeDate: z.string().refine(date => new Date(date) <= new Date(), {
    message: 'Date issued cannot be in the future'
  }),
  type: z.string(),
  description: z.string(),
  personComplained: z.string()
})

type DisputeFormValues = z.infer<typeof DisputeFormSchema>

interface ReportFormProps {
  disputeTypes: DisputeType[]
  users: PersonalInfo[]
}

export const ReportForm: React.FC<ReportFormProps> = ({
  disputeTypes,
  users
}) => {
  const pageTitle = 'File a Dispute'
  const pageDescription =
    "Fill out the Dispute Form to formally request for a dispute resolution from the Homeowners' Association."

  const user = useCurrentUser()
  const router = useRouter()
  const toast = useToast()

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

  const form = useForm<DisputeFormValues>({
    resolver: zodResolver(DisputeFormSchema),
    defaultValues: {
      disputeDate: '',
      type: '',
      description: '',
      personComplained: ''
    }
  })

  const onSubmit = async (values: DisputeFormValues) => {
    if (isPending) return

    setIsPending(true)

    const formData = {
      ...values,
      documents: filesUploaded.filter(file => file.trim() !== ''),
      disputeDate: new Date(values.disputeDate)
    }

    try {
      const data = await createDispute(formData)
      if (data.success) {
        console.log(data.success)
        router.push(
          `/user/disputes/submitted-disputes/view-progress/${data.dispute.id}`
        )
        form.reset()
        toast({
          title: `Dispute Form Submitted`,
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
              <FormField
                control={form.control}
                name='disputeDate'
                render={({ field, fieldState: { error } }) => (
                  <FormControl isRequired isInvalid={!!error}>
                    <FormLabel fontSize='md' fontFamily='font.body'>
                      Date of Dispute:
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
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='md' fontFamily='font.body'>
                      Dispute Type
                    </FormLabel>
                    <Select
                      size='sm'
                      fontFamily='font.body'
                      onChange={field.onChange}
                      value={field.value}
                    >
                      <option value='' disabled>
                        Select a dispute type
                      </option>
                      {disputeTypes
                        .slice()
                        .sort((a, b) => {
                          if (a.title === 'Other') return 1
                          if (b.title === 'Other') return -1
                          return a.title.localeCompare(b.title)
                        })
                        .filter(dispute => {
                          return (
                            user?.info.committee ===
                              'Grievance & Adjudication Committee' ||
                            user?.role === 'SUPERUSER' ||
                            !dispute.title.includes(
                              '(For Officer Submission only)'
                            )
                          )
                        })
                        .map(dispute => (
                          <option key={dispute.id} value={dispute.id}>
                            {dispute.title.replace(
                              '(For Officer Submission only)',
                              ''
                            )}
                          </option>
                        ))}
                    </Select>
                    {(user?.info.committee ===
                      'Grievance & Adjudication Committee' ||
                      user?.role === 'SUPERUSER') && (
                      <FormHelperText fontSize='xs' fontFamily='font.body'>
                        Note: Selecting the{' '}
                        <span className='font-semibold'>
                          Community Safety Emergencies
                        </span>{' '}
                        dispute type is solely for documentation purposes; it
                        will not be reviewed through the system's dispute
                        resolution process.
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              {/* Person being complained */}
              <FormField
                control={form.control}
                name='personComplained'
                render={({ field }) => (
                  <FormControl isRequired>
                    <HStack justifyContent='space-between'>
                      <FormLabel fontSize='md' fontFamily='font.body'>
                        Name of Homeowner being Complained (Complainee)
                      </FormLabel>
                    </HStack>

                    <Box display='flex' alignItems='center'>
                      <Select
                        size='sm'
                        fontFamily='font.body'
                        w='full'
                        onChange={field.onChange}
                        value={field.value}
                      >
                        <option value='' disabled>
                          Select from users...
                        </option>
                        {users.map(user => {
                          if (user.userId !== user?.id) {
                            return (
                              <option key={user.userId} value={user.userId}>
                                {user.firstName} {user.lastName}
                              </option>
                            )
                          }
                        })}
                      </Select>
                    </Box>

                    <FormHelperText fontSize='xs' fontFamily='font.body'>
                      This will allow us to contact the individual involved in
                      the dispute.
                    </FormHelperText>
                  </FormControl>
                )}
              />

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
                  endpoint='mixedUploader'
                  onClientUploadComplete={res =>
                    handleFileUploadChange(res[0].url)
                  }
                  onUploadError={error => console.log(error)}
                />
                <FormHelperText fontSize='xs' fontFamily='font.body'>
                  This will allow us to gain more information about the dispute
                  that would help us in decision making.
                </FormHelperText>
              </FormControl>

              {/* Submit Button */}
              <Box textAlign='center'>
                <FormControl>
                  <Button
                    size='sm'
                    type='submit'
                    colorScheme='yellow'
                    my='20px'
                    isLoading={isPending}
                    loadingText='Submitting'
                  >
                    Submit Dispute Form
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

export default ReportForm
