import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Input,
  Stack,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ViolationOfficerActivity, ReportStatus } from '@prisma/client'
import { useState } from 'react'

import { useRouter } from 'next/navigation'
import {
  createViolationProgressReport,
  updateViolation,
  updateViolationOfficerTask
} from '@/server/actions/violation'

export default function ProgressReportForm ({
  keyActivities,
  reportDetails
}: {
  keyActivities: ViolationOfficerActivity[]
  reportDetails: any
}) {
  const [forActivity, setForActivity] = useState('')
  const [progressTitle, setProgressTitle] = useState('')
  const [progressDescription, setProgressDescription] = useState('')
  const router = useRouter()
  const toast = useToast()

  const onSubmit = async (isSubActivity: boolean) => {
    const formData = {
      activity: forActivity,
      title: progressTitle,
      description: progressDescription
    }

    await createViolationProgressReport(formData).then(data => {
      console.log(data.success)
    })

    if (!isSubActivity) {
      await updateViolationOfficerTask(forActivity, true).then(data => {
        const allDoneExceptLast = keyActivities
          .slice(0, -1)
          .every(activity => activity.isDone === true)

        console.log(allDoneExceptLast)

        if (allDoneExceptLast) {
          const update = {
            step: 6,
            progress: 'Step 6: Violation Enforcement with Penalty Fee',
            status: ReportStatus.FOR_FINAL_REVIEW
          }

          updateViolation(keyActivities[0].violationId, update).then(data => {
            console.log(data.success)
          })
        }
        console.log(data.success)
      })

      router.refresh()
      router.push(
        `/user/violations/violation-record/view-progress/${reportDetails.violation.id}`
      )
      window.location.reload()
    }
  }

  const handleSubmitSubActivity = async () => {
    const selectedActivity = keyActivities.find(
      activity => activity.id === forActivity
    )
    if (selectedActivity) {
      toast({
        title: `Sub-activity Progress Report Submitted`,
        description: (
          <Stack spacing={0}>
            <Text>
              Violation No.: #V
              {reportDetails.violation.number.toString().padStart(4, '0')}
            </Text>
            <Text>Key Activity: {selectedActivity.title}</Text>
          </Stack>
        ),
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      })
    }
    await onSubmit(true)
    router.refresh()
    router.push(
      `/user/violations/violation-record/view-progress/${reportDetails.violation.id}`
    )
    window.location.reload()
  }

  const handleMarkActivityDone = async () => {
    const selectedActivity = keyActivities.find(
      activity => activity.id === forActivity
    )
    if (selectedActivity) {
      toast({
        title: `Enforcement Key Activity Marked as Done`,
        description: (
          <Stack spacing={0}>
            <Text>
              Violation No.: #V
              {reportDetails.violation.number.toString().padStart(4, '0')}
            </Text>
            <Text>Key Activity: {selectedActivity.title}</Text>
          </Stack>
        ),
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      })
    }
    await onSubmit(false)
    router.refresh()
    router.push(
      `/user/violations/violation-record/view-progress/${reportDetails.violation.id}`
    )
    window.location.reload()
  }

  return (
    <form>
      <Stack spacing='15px'>
        <Box>
          <Text fontWeight='semibold' fontFamily='font.heading' lineHeight={1}>
            Write a progress report
          </Text>
          <Text fontFamily='font.body' fontSize='sm'>
            Write a progress report for an activity to demonstrate that it is
            being completed by the due date.
          </Text>
        </Box>
        <Flex justifyContent='space-between' gap={5} fontFamily='font.body'>
          <Input
            type='string'
            fontSize='md'
            fontFamily='font.body'
            fontWeight='semibold'
            placeholder='Enter a progress title...'
            onChange={e => setProgressTitle(e.target.value)}
          />
          <Select onValueChange={setForActivity} defaultValue={forActivity}>
            <SelectTrigger>
              <SelectValue placeholder='Select activity' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {keyActivities.map(activity => {
                  if (activity.isDone) {
                    return null
                  }

                  return (
                    <SelectItem key={activity.id} value={activity.id}>
                      {activity.title}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Flex>
        <Textarea
          fontSize='sm'
          fontFamily='font.body'
          placeholder='Write something...'
          height='15vh'
          resize='none'
          overflowY='auto'
          onChange={e => setProgressDescription(e.target.value)}
        ></Textarea>
        <ButtonGroup className='justify-end'>
          <Button
            type='button'
            colorScheme='yellow'
            size='sm'
            w='min-content'
            onClick={handleSubmitSubActivity}
          >
            Submit as Sub-Activity
          </Button>
          <Button
            type='button'
            colorScheme='green'
            size='sm'
            w='min-content'
            onClick={handleMarkActivityDone}
          >
            Submit & Mark Activity as Done
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  )
}
