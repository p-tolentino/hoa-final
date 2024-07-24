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
  createMaintenanceNotice,
  updateMaintenanceRequest,
  updateNoticeSent
} from '@/server/actions/maintenance-request'
import { createNotification } from '@/server/actions/notification'
import {
  Text,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useToast,
  Box,
  FormHelperText,
  Select
} from '@chakra-ui/react'
import { PersonalInfo } from '@prisma/client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function WriteMaintenanceNotice ({
  reportDetails
}: {
  reportDetails: any
}) {
  const today = new Date().toISOString().split('T')[0]
  const noticeSubjectPlaceholder = `#M${reportDetails.maintenance.number
    .toString()
    .padStart(4, '0')} Maintenance Notice: ${
    reportDetails.maintenanceType.title
  }`
  const [noticeSubject, setNoticeSubject] = useState(noticeSubjectPlaceholder)
  const [noticeBody, setNoticeBody] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const [isOpen, setIsOpen] = useState(false) // Dialog open state

  const router = useRouter()

  const toast = useToast()

  const onSubmit = async () => {
    setIsButtonClicked(true)

    const formData = {
      subject: noticeSubject,
      description: noticeBody,
      location: reportDetails.location,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime: startTime,
      endTime: endTime,
      sender: reportDetails.maintenance.officerAssigned,
      idToLink: reportDetails.maintenance.id
    }

    console.log(formData)

    await createMaintenanceNotice(formData).then(async data => {
      console.log(data)

      reportDetails.userInfos.map(async (userInfo: PersonalInfo) => {
        const notifNoticeData = {
          type: 'maintenanceNotice',
          recipient: userInfo.userId,
          title: `#M${reportDetails.maintenance.number
            .toString()
            .padStart(4, '0')} Maintenance Notice: ${
            reportDetails.maintenanceType.title
          }`,
          description: `A maintenance activity is scheduled on ${startDate} to ${endDate}. Please see the Facility Announcement Board for more details.`,
          linkToView: `/user/maintenance`
        }

        await createNotification(notifNoticeData).then(data => {
          if (data.success) {
            console.log(data.success)
          }
        })
      })

      await updateNoticeSent(reportDetails.maintenance.id, true).then(
        async data => {
          console.log(data.success)

          const update = {
            step: 5,
            progress: 'Step 5: Negotiations to Resolve Maintenance',
            status: `Maintenance in Progress`
          }

          await updateMaintenanceRequest(
            reportDetails.maintenance.id,
            update
          ).then(data => {
            console.log(data.success)
            setIsOpen(false)
          })

          toast({
            title: `Maintenance Notice sent to Homeowners`,
            description: `${noticeSubjectPlaceholder}`,
            status: 'success',
            position: 'bottom-right',
            isClosable: true
          })
        }
      )
    })

    router.push(
      `/user/maintenance/maintenance-record/view-progress/${reportDetails.maintenance.id}`
    )
    window.location.reload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          Write Maintenance Notice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Write Maintenance Notice</DialogTitle>
            <DialogDescription>
              Write a maintenance notice to be sent to the homeowners.
            </DialogDescription>
          </DialogHeader>
          {/* Form Content */}
          <Stack spacing='15px' my='1.5rem' fontFamily='font.body'>
            <FormControl isRequired as={Flex} alignItems='center'>
              <FormLabel>Subject:</FormLabel>
              <Input
                size='sm'
                type='string'
                placeholder={noticeSubjectPlaceholder}
                defaultValue={noticeSubjectPlaceholder}
                onChange={e => setNoticeSubject(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired as={Flex} alignItems='center'>
              <FormLabel>Location:</FormLabel>
              <Input
                type='string'
                value={`${reportDetails.location}`}
                disabled
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Duration:</FormLabel>
              <Stack spacing={1}>
                <Flex gap={5}>
                  <Stack spacing={1} w='full'>
                    <FormHelperText>Start Date:</FormHelperText>
                    <Input
                      size='sm'
                      type='date'
                      min={today}
                      onChange={e => setStartDate(e.target.value)}
                    />
                  </Stack>
                  <Stack spacing={1} w='full'>
                    <FormHelperText>End Date:</FormHelperText>
                    <Input
                      size='sm'
                      type='date'
                      min={today}
                      onChange={e => setEndDate(e.target.value)}
                    />
                  </Stack>
                </Flex>
                <Flex gap={5}>
                  <Stack spacing={1} w='full'>
                    <FormHelperText>Start Time:</FormHelperText>
                    <Input
                      size='sm'
                      type='time'
                      onChange={e => setStartTime(e.target.value)}
                    />
                  </Stack>
                  <Stack spacing={1} w='full'>
                    <FormHelperText>End Time:</FormHelperText>
                    <Input
                      size='sm'
                      type='time'
                      onChange={e => setEndTime(e.target.value)}
                    />
                  </Stack>
                </Flex>
              </Stack>
            </FormControl>

            <FormControl isRequired>
              <Textarea
                fontSize='sm'
                fontFamily='font.body'
                defaultValue={noticeBody}
                placeholder={'Write something to include in the notice...'}
                height='10vh'
                resize='none'
                overflowY='auto'
                onChange={e => setNoticeBody(e.target.value)}
              />
            </FormControl>
          </Stack>
          <DialogFooter>
            <Button
              size='sm'
              colorScheme='yellow'
              type='button'
              isLoading={isButtonClicked}
              loadingText='Sending'
              onClick={() => onSubmit()}
            >
              Send Maintenance Notice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
