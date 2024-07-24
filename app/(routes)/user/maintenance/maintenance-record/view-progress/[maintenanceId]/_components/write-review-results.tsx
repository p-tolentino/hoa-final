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
import {
  createOfficerTasks,
  updateMaintenanceRequest
} from '@/server/actions/maintenance-request'
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
import { MaintenanceRequest, PersonalInfo } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function WriteReviewResults ({
  maintenance,
  committee,
  reportDetails
}: {
  maintenance: MaintenanceRequest
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

  const defaultDuplicateMessage =
    'Greetings Homeowner! We noticed that your maintenance request submission is a duplicate of a previously submitted maintenance ticket. Rest assured that the maintenance request for this will be handled. Thank you for your patience.'

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

  const today = new Date().toISOString().split('T')[0]

  const toast = useToast()

  const onSubmit = async () => {
    setIsButtonClicked(true)

    const formData = {
      committeeReview: review,
      status: 'Pending Maintenance Notice',
      officerAssigned: selectedMember,
      commReviewDate: new Date(),
      progress: 'Step 4: Send out Maintenance Notice',
      step: 4
    }

    const declined = {
      committeeReview:
        selectedOption === 'DECLINE' ? assessment : defaultDuplicateMessage,
      commReviewDate: new Date(),
      status: 'Closed',
      reasonToClose:
        selectedOption === 'DECLINE'
          ? 'Insufficient Evidence'
          : 'Duplicate Submission'
    }

    if (selectedOption === 'ACCEPT') {
      await updateMaintenanceRequest(maintenance.id, formData).then(data =>
        console.log(data.success)
      )
      await Promise.all(
        keyActivities.map(async activity => {
          const data = {
            maintainReqId: maintenance.id,
            title: activity.activity,
            deadline: new Date(activity.dueDate)
          }
          await createOfficerTasks(data).then(data => {
            console.log(data.success)
          })
          console.log(activity)
        })
      )
    } else if (selectedOption !== 'ACCEPT') {
      await updateMaintenanceRequest(maintenance.id, declined).then(data => {
        console.log(data.success)
      })
    }

    setIsOpen(false)
    router.refresh()
    router.push(
      `/user/maintenance/maintenance-record/view-progress/${maintenance.id}`
    )

    toast({
      title: `Case Review Results Submitted`,
      description: (
        <>
          <div>
            Maintenance Ticket No. #M
            {reportDetails.maintenance.number.toString().padStart(4, '0')}
          </div>
          <div>Verdict: {selectedOption}</div>
        </>
      ),
      status: 'success',
      position: 'bottom-right',
      isClosable: true,
      colorScheme: selectedOption === 'ACCEPT' ? 'green' : 'red'
    })

    window.location.reload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          Write Maintenance Ticket Review Results
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Write Maintenance Ticket Review Results</DialogTitle>
            <DialogDescription>
              Fill out the following fields as a guide to write the maintenance
              ticket review results formulated by the committee.
            </DialogDescription>
          </DialogHeader>
          {/* Form Content */}
          <Stack spacing={5} my='1.5rem'>
            <Stack>
              <Text fontSize='sm' fontFamily='font.body'>
                What is the committee's verdict for this maintenance ticket?
              </Text>
              <RadioGroup
                defaultValue=''
                size='sm'
                value={selectedOption}
                onChange={handleRadioChange}
              >
                <Stack
                  direction='column'
                  fontFamily='font.body'
                  textAlign='justify'
                >
                  <Box
                    pl='0.5rem'
                    bg={selectedOption === 'ACCEPT' ? 'yellow.100' : ''}
                  >
                    <Radio value='ACCEPT' colorScheme='yellow'>
                      <span className='font-bold'>ACCEPT</span> the maintenance
                      ticket and proceed to handle the necessary maintenance
                      activities.
                    </Radio>
                  </Box>
                  <Box
                    pl='0.5rem'
                    bg={selectedOption === 'DECLINE' ? 'red.100' : ''}
                  >
                    <Radio value='DECLINE' colorScheme='red'>
                      <span className='font-bold'>DECLINE</span> the maintenance
                      ticket due to the lack of sufficient evidence.
                    </Radio>
                  </Box>
                  <Box
                    pl='0.5rem'
                    bg={selectedOption === 'DUPLICATE' ? 'orange.100' : ''}
                  >
                    <Radio value='DUPLICATE' colorScheme='red'>
                      The maintenance ticket is a{' '}
                      <span className='font-bold'>DUPLICATE</span> of a
                      previously submitted maintenance ticket.
                    </Radio>
                  </Box>
                </Stack>
              </RadioGroup>
            </Stack>

            {/* when ACCEPT option is clicked */}
            {selectedOption === 'ACCEPT' && (
              <Stack spacing={5} overflowY='auto' h='250px'>
                <FormControl isRequired>
                  <Stack spacing={2}>
                    <Textarea
                      fontSize='sm'
                      fontFamily='font.body'
                      placeholder='Provide a brief review of the review...'
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
                      <Text fontSize='sm' fontFamily='font.body'>
                        Please select a Environment and Security Officer to
                        oversee the resolution of this maintenance activity.
                      </Text>
                    </Box>
                    <Select
                      value={selectedMember}
                      onValueChange={setSelectedMember}
                    >
                      <SelectTrigger className='w-[100%]'>
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
                      <Text fontSize='sm' fontFamily='font.body'>
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
                      <Table size='xs' variant='simple' fontFamily='font.body'>
                        <Thead>
                          <Tr>
                            <Th fontSize='xs' fontFamily='font.body' w='full'>
                              Activity
                            </Th>
                            <Th fontSize='xs' fontFamily='font.body'>
                              Due Date
                            </Th>
                            <Th px='10px'>
                              {/* Add Row Button */}
                              <Button size='xs' onClick={handleAddRow}>
                                <AddIcon />
                              </Button>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody fontSize='sm' fontFamily='font.body'>
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

            {/* when DECLINE option is clicked */}
            {selectedOption === 'DECLINE' && (
              <Stack>
                <Text fontSize='sm' fontFamily='font.body' textAlign='justify'>
                  <span className='font-semibold'>Note: </span>The homeowner who
                  intiailly submitted the maintenance request will receive this
                  notification message.
                </Text>
                <Textarea
                  fontSize='sm'
                  fontFamily='font.body'
                  placeholder='Provide a brief explanation for declining this maintenance ticket to the homeowner who submitted the maintenance request...'
                  height='20vh'
                  resize='none'
                  value={assessment}
                  onChange={e => setAssessment(e.target.value)}
                />
              </Stack>
            )}

            {/* when DUPLICATE option is clicked */}
            {selectedOption === 'DUPLICATE' && (
              <Stack>
                <Text fontSize='sm' fontFamily='font.body' textAlign='justify'>
                  <span className='font-semibold'>Note: </span>The homeowner who
                  intiailly submitted the maintenance request will receive this
                  notification message. This message may be modified as
                  required.
                </Text>
                <Textarea
                  fontSize='sm'
                  fontFamily='font.body'
                  placeholder='Provide a brief explanation for marking this maintenance ticket as a duplicate to the homeowner who submitted the maintenance request...'
                  height='20vh'
                  resize='none'
                  defaultValue={defaultDuplicateMessage}
                  onChange={e => setAssessment(e.target.value)}
                />
              </Stack>
            )}
          </Stack>
          <DialogFooter>
            <Button
              size='sm'
              colorScheme='yellow'
              type='button'
              mt={5}
              isLoading={isButtonClicked}
              loadingText='Submitting'
              onClick={() => onSubmit()}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
