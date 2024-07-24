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
  HStack,
  Spacer,
  Divider,
  CheckboxGroup,
  Checkbox,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  FormHelperText,
  Icon,
  RadioGroup,
  Radio,
  FormErrorMessage
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, addDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { parseISO, isBefore, isPast, isToday } from 'date-fns'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // Import the CSS

import {
  Form,
  FormControl as ShadControl,
  FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage
} from '@/components/ui/form'

import { OptionSchema, QuestionSchema, PollSchema } from '@/server/schemas'
import * as z from 'zod'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createPoll } from '@/server/actions/poll'

type PostFormValues = z.infer<typeof PollSchema>

interface Option {
  text: string
}

interface Question {
  text: string
  options: Option[]
}

function Create () {
  const router = useRouter()
  const { update } = useSession()
  const [isOpen, setIsOpen] = useState(false) // Step 1: Dialog open state
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(PollSchema),
    defaultValues: {
      title: '' || undefined,
      description: '' || undefined,
      category: undefined,
      startDate: '' || undefined,
      endDate: '' || undefined,
      status: 'INACTIVE' || undefined,
      questions: [
        {
          text: '' || undefined,
          options: [
            {
              text: '' || undefined
            }
          ]
        }
      ]
    }
  })

  const {
    control,
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset
  } = form

  const {
    fields: questionFields,
    append: appendQuest,
    remove: removeQuest
  } = useFieldArray({
    control,
    name: 'questions'
  })

  const appendOption = (qIndex: number, newOption: Option = { text: '' }) => {
    // Type assertion here, telling TypeScript `getValues('questions')` will not be undefined
    const questions: Question[] = getValues('questions') as Question[]

    questions[qIndex].options.push(newOption)
    setValue('questions', questions) // No need to spread here since we're modifying and setting the entire array
  }

  const removeOption = (qIndex: number, oIndex: number) => {
    // Get the current questions array from the form
    const questions: Question[] = getValues('questions') as Question[]

    // Make sure the question and options array exists
    if (questions && questions[qIndex] && questions[qIndex].options) {
      // Copy the options array for mutation
      const updatedOptions = [...questions[qIndex].options]

      // Remove the option at the specified index
      updatedOptions.splice(oIndex, 1)

      // Update the specific question's options in the questions array
      const updatedQuestions = [...questions]
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        options: updatedOptions
      }

      // Use setValue to update the questions in the form with the modified array
      setValue('questions', updatedQuestions)
    }
  }

  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')

  const onSubmit = async (values: PostFormValues) => {
    setIsButtonClicked(true)

    // Clear previous errors
    setStartDateError('')
    setEndDateError('')

    if (values.startDate && values.endDate) {
      const startDate = parseISO(values.startDate)
      const endDate = parseISO(values.endDate)
      const now = new Date()

      // First Condition: Start date is not equal to the end date
      if (startDate.getTime() === endDate.getTime()) {
        console.log('1')
        setStartDateError('Start date cannot be equal to end date.')
        setEndDateError('End date cannot be equal to start date.')
        return
      }

      // Second Condition: Start date must not be in the past
      if (isPast(startDate)) {
        console.log('2')
        setStartDateError('Start date cannot be in the past.')
        setEndDateError('')
        return
      }

      // Third Condition: End date must not be in the past and must be after the start date
      else if (isPast(endDate)) {
        console.log('3')
        setStartDateError('')
        setEndDateError('End date cannot be in the past.')
        return
      }
      if (isBefore(endDate, startDate)) {
        console.log('4')
        setStartDateError('')
        setEndDateError('End date must be after the start date.')
        return
      }

      // Proceed with form submission if dates are valid
      console.log('Proceeding with form submission', values)
      try {
        await createPoll(values)
        form.reset() // Reset form upon success
        setIsOpen(false) // Close dialog upon success
        router.refresh() // Refresh the page or navigate as needed
        console.log('Post created successfully', values)
      } catch (error) {
        console.error('Failed to create post:', error)
        // Handle error state here, if needed
      }
    } else {
      console.error('Start date and end date are required.')
      // Handle showing this error to the user
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          <AddIcon boxSize={3} mr='10px' />
          Create Poll / Survey
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[500px] overflow-y-auto overflow-x-hidden'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Poll / Survey</DialogTitle>
              <DialogDescription>
                Fill up the following fields to create a poll or survey.
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <Box w='470px' pr={3} my='1rem'>
              <Stack spacing='10px'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontSize='sm' fontWeight='semibold'>
                        Title:
                      </FormLabel>
                      <Input
                        size='md'
                        fontWeight='semibold'
                        type='string'
                        {...field}
                        placeholder='Enter a Title'
                      />
                    </FormControl>
                  )}
                />
                {/* Duration */}
                <HStack w='min-content' spacing={3}>
                  <FormField
                    name='startDate'
                    control={form.control}
                    render={({ field }) => (
                      <FormControl isRequired isInvalid={startDateError !== ''}>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Start Date and Time:
                        </FormLabel>
                        <ReactDatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={date => {
                            // Format the date to a string and pass it on
                            const dateString = date
                              ? format(date, 'yyyy-MM-dd HH:mm:ss')
                              : null
                            field.onChange(dateString)
                          }}
                          showTimeSelect
                          placeholderText='Select Date and Time'
                          dateFormat='MMMM d, yyyy h:mm aa'
                          className='w-[max-content] border p-2 text-sm'
                        />
                        {startDateError && (
                          <FormErrorMessage>{startDateError}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  />
                  <FormField
                    name='endDate'
                    control={form.control}
                    render={({ field }) => (
                      <FormControl isRequired isInvalid={endDateError !== ''}>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          End Date and Time:
                        </FormLabel>
                        <ReactDatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={date => {
                            // Format the date to a string and pass it on
                            const dateString = date
                              ? format(date, 'yyyy-MM-dd HH:mm:ss')
                              : null
                            field.onChange(dateString)
                          }}
                          showTimeSelect
                          placeholderText='Select Date and Time'
                          dateFormat='MMMM d, yyyy h:mm aa'
                          className='w-[max-content] border p-2 text-sm'
                        />
                        {endDateError && (
                          <FormErrorMessage>{endDateError}</FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  />
                </HStack>
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
                        id='discussionPost'
                        fontSize='xs'
                        resize='none'
                        h='100px'
                        {...field}
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
                        value={field.value || ''}
                        onChange={field.onChange}
                        colorScheme='yellow'
                      >
                        <Stack
                          spacing={5}
                          direction='row'
                          fontFamily='font.body'
                        >
                          <Radio value='MEETING'>Meeting</Radio>
                          <Radio value='ELECTION'>Election</Radio>
                          <Radio value='INQUIRY'>Inquiry</Radio>
                          <Radio value='EVENT'>Event</Radio>
                          <Radio value='OTHER'>Other</Radio>
                        </Stack>
                      </RadioGroup>
                      <FormHelperText fontSize='xs' mt={3}>
                        Select the category that applies to your post for
                        members to easily find it.
                      </FormHelperText>
                    </FormControl>
                  )}
                />
                <Divider />
                <Box p='15px' maxH='150px' overflowY='auto' mb={5}>
                  <Stack spacing='10px'>
                    {questionFields.map((question, qIndex) => (
                      <FormControl key={question.id} isRequired mb='3%'>
                        <HStack>
                          <FormLabel fontSize='sm' fontWeight='semibold'>
                            Question {qIndex + 1}:
                          </FormLabel>
                          <Spacer />
                          <Box alignSelf='center'>
                            <HStack>
                              {questionFields.length > 1 && (
                                <Button
                                  size='xs'
                                  colorScheme='red'
                                  type='button'
                                  onClick={() => removeQuest(qIndex)}
                                >
                                  <DeleteIcon />
                                </Button>
                              )}
                            </HStack>
                          </Box>
                        </HStack>
                        <Input
                          size='sm'
                          {...register(`questions.${qIndex}.text`)}
                          placeholder={`Question ${qIndex + 1}`}
                          fontWeight='semibold'
                        />
                        {question.options &&
                          question.options.map((option, oIndex) => (
                            <HStack key={oIndex} mt={2}>
                              <Input
                                size='sm'
                                {...register(
                                  `questions.${qIndex}.options.${oIndex}.text`
                                )}
                                placeholder={`Option ${oIndex + 1}`}
                              />
                              {oIndex >= 0 && (
                                <Button
                                  size='xs'
                                  onClick={() => appendOption(qIndex)}
                                >
                                  <AddIcon />
                                </Button>
                              )}
                              {oIndex > 0 && (
                                <Button
                                  size='xs'
                                  colorScheme='red'
                                  onClick={() => removeOption(qIndex, oIndex)}
                                >
                                  <DeleteIcon />
                                </Button>
                              )}
                            </HStack>
                          ))}
                        {/* Button to add an option to this question */}
                        {qIndex === questionFields.length - 1 && (
                          <Button
                            mt={5}
                            size='xs'
                            type='button'
                            onClick={() =>
                              appendQuest({
                                text: '',
                                options: [{ text: '' }]
                              })
                            }
                          >
                            Add Question
                          </Button>
                        )}
                      </FormControl>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <DialogFooter>
              <Button
                size='sm'
                colorScheme='yellow'
                type='submit'
                isLoading={isButtonClicked}
                loadingText='Publishing'
              >
                Publish Poll / Survey
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default Create
