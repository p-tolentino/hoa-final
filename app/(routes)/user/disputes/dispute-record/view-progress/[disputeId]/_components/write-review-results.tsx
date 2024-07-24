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
import { createOfficerTasks, updateDispute } from '@/server/actions/dispute'
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
  useToast
} from '@chakra-ui/react'
import { Dispute, PersonalInfo, ReportStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function WriteReviewResults ({
  dispute,
  committee,
  reportDetails
}: {
  dispute: Dispute
  committee: PersonalInfo[]
  reportDetails: any
}) {
  const [isOpen, setIsOpen] = useState(false) // Dialog open state
  const [selectedMember, setSelectedMember] = useState('')
  const [review, setReview] = useState('')
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
  const toast = useToast()

  const [keyActivities, setKeyActivities] = useState([
    { activity: '', dueDate: '' }
  ])

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

    const formData = {
      committeeReview: review,
      status: ReportStatus.PENDING_LETTER_TO_BE_SENT,
      officerAssigned: selectedMember,
      commReviewDate: new Date(),
      progress: 'Step 4: Send out Dispute Letter',
      step: 4
    }

    await updateDispute(dispute.id, formData).then(async data => {
      console.log(data.success)
    })

    await Promise.all(
      keyActivities.map(async activity => {
        const data = {
          disputeId: dispute.id,
          title: activity.activity,
          deadline: new Date(activity.dueDate)
        }
        await createOfficerTasks(data).then(data => {
          console.log(data.success)
        })
        console.log(activity)
      })
    )

    toast({
      title: `Case Review Results Submitted`,
      description: `Dispute No. #D${reportDetails.dispute.number
        .toString()
        .padStart(4, '0')}`,
      status: 'success',
      position: 'bottom-right',
      isClosable: true
    })

    window.location.reload()

    setIsOpen(false)
    router.refresh()
    router.push(`/user/disputes/dispute-record/view-progress/${dispute.id}`)
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
            px={1}
            h='300px'
            pr={3}
            overflowY='auto'
            fontFamily='font.body'
          >
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
                    Please select a <u>Grievance and Adjudication Officer</u> to
                    oversee the resolution of this dispute case.
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
                        <SelectItem key={member.userId} value={member.userId}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Stack>
            </FormControl>

            <Stack spacing={2}>
              <Box>
                <FormLabel fontSize='sm' fontWeight='semibold' mb='0'>
                  Key Activities and Due Dates
                </FormLabel>
                <Text fontSize='sm'>
                  Please enter the key activities and its corresponding due
                  dates to enforce immediate actions for this violation case.
                </Text>
              </Box>
              <TableContainer mx='1rem' mt='0.5rem' overflowY='auto' h='120px'>
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
                                const updatedActivities = [...keyActivities]
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
                                const updatedActivities = [...keyActivities]
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
