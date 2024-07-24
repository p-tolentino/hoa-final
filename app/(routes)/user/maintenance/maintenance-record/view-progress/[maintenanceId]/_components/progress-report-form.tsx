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
import { MaintenanceOfficerActivity } from '@prisma/client'
import { useState } from 'react'

import { useRouter } from 'next/navigation'
import {
  createMaintenanceProgressReport,
  updateMaintenanceRequest,
  updateMaintenanceOfficerTask
} from '@/server/actions/maintenance-request'

export default function ProgressReportForm ({
  keyActivities,
  reportDetails
}: {
  keyActivities: MaintenanceOfficerActivity[]
  reportDetails: any
}) {
  const [forActivity, setForActivity] = useState('')
  const [progressTitle, setProgressTitle] = useState('')
  const [progressDescription, setProgressDescription] = useState('')
  const router = useRouter()

  const onSubmit = async (isSubActivity: boolean) => {
    const formData = {
      activity: forActivity,
      title: progressTitle,
      description: progressDescription
    }

    await createMaintenanceProgressReport(formData).then(data => {
      console.log(data.success)
    })

    if (!isSubActivity) {
      await updateMaintenanceOfficerTask(forActivity, true).then(data => {
        const allDoneExceptLast = keyActivities
          .slice(0, -1)
          .every(activity => activity.isDone === true)

        console.log(allDoneExceptLast)

        if (allDoneExceptLast) {
          const update = {
            step: 6,
            progress: 'Step 6: Maintenance Resolution with Corrective Actions',
            status: 'For Final Report'
          }

          updateMaintenanceRequest(keyActivities[0].maintainReqId, update).then(
            data => {
              console.log(data.success)
            }
          )
        }

        console.log(data.success)
      })

      router.refresh()
      router.push(
        `/user/maintenance/maintenance-record/view-progress/${reportDetails.maintenance.id}`
      )
      window.location.reload()
    }
  }

  const toast = useToast()

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
              Maintenance No.: #D
              {reportDetails.maintenance.number.toString().padStart(4, '0')}
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
      `/user/maintenance/maintenance-record/view-progress/${reportDetails.maintenance.id}`
    )
    window.location.reload()
  }

  const handleMarkActivityDone = async () => {
    const selectedActivity = keyActivities.find(
      activity => activity.id === forActivity
    )
    if (selectedActivity) {
      toast({
        title: `Resolution Key Activity Marked as Done`,
        description: (
          <Stack spacing={0}>
            <Text>
              Maintenance No.: #D
              {reportDetails.maintenance.number.toString().padStart(4, '0')}
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
      `/user/maintenance/maintenance-record/view-progress/${reportDetails.maintenance.id}`
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
        <Flex justifyContent='space-between' gap={5}>
          <Input
            type='string'
            fontSize='md'
            fontFamily='font.body'
            fontWeight='semibold'
            placeholder='Enter a progress title'
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
          height='20vh'
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
