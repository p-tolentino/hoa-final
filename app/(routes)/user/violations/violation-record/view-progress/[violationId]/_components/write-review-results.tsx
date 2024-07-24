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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { createOfficerTasks, updateViolation } from '@/server/actions/violation'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Textarea,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Td,
  Th,
  Tr,
  Box,
  useToast,
  RadioGroup,
  Radio
} from '@chakra-ui/react'
import { Violation, PersonalInfo, ReportStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function WriteReviewResults ({
  violation,
  committee,
  reportDetails
}: {
  violation: Violation
  committee: PersonalInfo[]
  reportDetails: any
}) {
  const [isOpen, setIsOpen] = useState(false) // Dialog open state
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedMember, setSelectedMember] = useState('')
  const [review, setReview] = useState('')
  const [assessment, setAssessment] = useState('')
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const toast = useToast()

  const [keyActivities, setKeyActivities] = useState([
    { activity: '', dueDate: '' }
  ])

  const handleRadioChange = (value: string) => {
    setSelectedOption(value)
  }

  const handleAddRow = () => {
    setKeyActivities([...keyActivities, { activity: '', dueDate: '' }])
  }

  const handleRemoveRow = (index: number) => {
    const updatedActivities = [...keyActivities]
    updatedActivities.splice(index, 1)
    setKeyActivities(updatedActivities)
  }

  const onSubmit = async () => {
    setIsButtonClicked(true)
    // Validate key activities
    if (keyActivities.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one key activity.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      })
      return
    }

    for (const activity of keyActivities) {
      if (!activity.activity || !activity.dueDate) {
        toast({
          title: 'Error',
          description: 'Activity and Due Date cannot be empty.',
          status: 'error',
          position: 'bottom-right',
          isClosable: true
        })
        return
      }
    }

    const valid = {
      committeeReview: review,
      status: ReportStatus.PENDING_LETTER_TO_BE_SENT,
      officerAssigned: selectedMember,
      commReviewDate: new Date(),
      progress: 'Step 4: Send out Violation Letters',
      step: 4
    }

    const invalid = {
      committeeReview: assessment,
      status: ReportStatus.CLOSED,
      reasonToClose: 'Insufficient Evidence'
    }

    if (selectedOption === 'VALID') {
      await updateViolation(violation.id, valid).then(data =>
        console.log(data.success)
      )
      await Promise.all(
        keyActivities.map(async activity => {
          const data = {
            violationId: violation.id,
            title: activity.activity,
            deadline: new Date(activity.dueDate)
          }
          await createOfficerTasks(data).then(data => {
            console.log(data.success)
          })
          console.log(activity)
        })
      )
    } else if (selectedOption === 'INVALID') {
      await updateViolation(violation.id, invalid).then(data => {
        console.log(data.success)
      })
    }

    toast({
      title: `Case Review Results Submitted`,
      description: (
        <Stack spacing={0}>
          <Text>
            Violation No. #V
            {reportDetails.violation.number.toString().padStart(4, '0')}
          </Text>
          <Text>Verdict: {selectedOption}</Text>
        </Stack>
      ),
      status: 'success',
      position: 'bottom-right',
      isClosable: true,
      colorScheme: selectedOption === 'VALID' ? 'green' : 'red'
    })

    window.location.reload()

    setIsOpen(false)
    router.refresh()
    router.push(
      `/user/violations/violation-record/view-progress/${violation.id}`
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          Write Case Review Results
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader className='mb-5'>
            <DialogTitle>Write Case Review Results</DialogTitle>
            <DialogDescription>
              Fill out the following fields to write the case review results
              formulated by the committee.
            </DialogDescription>
          </DialogHeader>
          {/* Form Content */}
          <Stack
            spacing='15px'
            my='1.5rem'
            h={selectedOption ? '300px' : 'min-content'}
            pr={3}
            overflowY='auto'
            fontFamily='font.body'
          >
            <Stack>
              <Text fontSize='sm'>
                What is the committee's verdict for this violation case?
              </Text>
              <RadioGroup
                defaultValue=''
                size='sm'
                value={selectedOption}
                onChange={handleRadioChange}
              >
                <Stack direction='column' textAlign='justify'>
                  <Box
                    pl='0.5rem'
                    bg={selectedOption === 'VALID' ? 'yellow.100' : ''}
                  >
                    <Radio value='VALID' colorScheme='yellow'>
                      The violation case is{' '}
                      <span className='font-bold'>VALID</span> and requires
                      immediate actions.
                    </Radio>
                  </Box>
                  <Box
                    pl='0.5rem'
                    bg={selectedOption === 'INVALID' ? 'red.100' : ''}
                  >
                    <Radio value='INVALID' colorScheme='red'>
                      The violation case is{' '}
                      <span className='font-bold'>INVALID</span> due to the lack
                      of sufficient evidence.
                    </Radio>
                  </Box>
                </Stack>
              </RadioGroup>
            </Stack>

            {/* when VALID option is clicked */}
            {selectedOption === 'VALID' && (
              <Stack spacing={5} overflowY='auto' h='250px' px={1}>
                <FormControl isRequired>
                  <Stack spacing={2}>
                    <Textarea
                      fontSize='sm'
                      placeholder='Provide a brief review of the report...'
                      resize='none'
                      value={review}
                      onChange={e => setReview(e.target.value)}
                    />
                  </Stack>
                </FormControl>
                <FormControl isRequired>
                  <Stack spacing={2}>
                    <Box>
                      <FormLabel fontSize='sm' fontWeight='semibold' mb='0'>
                        Assign Officer
                      </FormLabel>
                      <Text fontSize='sm'>
                        Please select a <u>Security Officer</u> to oversee the
                        resolution of this violation case.
                      </Text>
                    </Box>
                    <Select
                      value={selectedMember}
                      onValueChange={setSelectedMember}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select committee member' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {committee.map(member => (
                            <SelectItem
                              key={member.userId}
                              value={member.userId}
                            >
                              {member.firstName} {member.lastName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Stack>
                </FormControl>
                <FormControl isRequired>
                  <Stack spacing={2}>
                    <Box>
                      <FormLabel fontSize='sm' fontWeight='semibold' mb='0'>
                        Key Activities and Due Dates
                      </FormLabel>
                      <Text fontSize='sm'>
                        Please enter the key activities and its corresponding
                        due dates to enforce immediate actions for this
                        violation case.
                      </Text>
                    </Box>
                    <TableContainer
                      mx='1rem'
                      mt='0.5rem'
                      overflowY='auto'
                      h='120px'
                    >
                      <Table size='xs' variant='simple'>
                        <Thead>
                          <Tr>
                            <Th fontSize='xs' w='full'>
                              Activity
                            </Th>
                            <Th fontSize='xs'>Due Date</Th>
                            <Th px='10px'>
                              {/* Add Row Button */}
                              <Button size='xs' onClick={handleAddRow}>
                                <AddIcon />
                              </Button>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody fontSize='sm'>
                          {keyActivities.map((activity, index) => (
                            <Tr key={index}>
                              {/* Activity Input */}
                              <Td>
                                <FormControl isRequired>
                                  <Input
                                    type='text'
                                    fontSize='sm'
                                    w='95%'
                                    value={activity.activity}
                                    onChange={e => {
                                      const updatedActivities = [
                                        ...keyActivities
                                      ]
                                      updatedActivities[index].activity =
                                        e.target.value
                                      setKeyActivities(updatedActivities)
                                    }}
                                  />
                                </FormControl>
                              </Td>
                              {/* Due Date Input */}
                              <Td>
                                <FormControl isRequired>
                                  <Input
                                    type='date'
                                    min={today}
                                    fontSize='sm'
                                    value={activity.dueDate}
                                    onChange={e => {
                                      const updatedActivities = [
                                        ...keyActivities
                                      ]
                                      updatedActivities[index].dueDate =
                                        e.target.value
                                      setKeyActivities(updatedActivities)
                                    }}
                                  />
                                </FormControl>
                              </Td>
                              {/* Delete Button */}
                              {index > 0 && (
                                <Td textAlign='center'>
                                  <Button
                                    size='xs'
                                    colorScheme='red'
                                    onClick={() => handleRemoveRow(index)}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Td>
                              )}
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </FormControl>
              </Stack>
            )}

            {/* when INVALID option is clicked */}
            {selectedOption === 'INVALID' && (
              <Stack>
                <Textarea
                  fontSize='sm'
                  placeholder='Provide a brief explanation for the invalidity of this violation case to the homeowner who filed the report...'
                  height='25vh'
                  resize='none'
                  value={assessment}
                  onChange={e => setAssessment(e.target.value)}
                />
              </Stack>
            )}
          </Stack>
          <DialogFooter>
            {/* FINISH REVIEW: when VALID option is clicked */}
            <Button
              size='sm'
              colorScheme={selectedOption === 'VALID' ? 'yellow' : 'red'}
              type='button'
              isLoading={isButtonClicked}
              loadingText={
                selectedOption === 'VALID' ? 'Submitting' : 'Closing'
              }
              onClick={() => onSubmit()}
            >
              {selectedOption === 'VALID'
                ? 'Submit Review'
                : 'Close Violation Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
