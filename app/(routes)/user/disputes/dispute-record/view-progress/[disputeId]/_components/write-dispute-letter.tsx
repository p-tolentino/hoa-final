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
import { updateDispute, updateLetterSent } from '@/server/actions/dispute'
import { createDisputeLetter } from '@/server/actions/letter-notice'
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
  useToast
} from '@chakra-ui/react'
import { LetterNoticeType, ReportStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function WriteDisputeLetter ({
  reportDetails
}: {
  reportDetails: any
}) {
  const letterSubjectPlaceholder = `#D${reportDetails.dispute.number
    .toString()
    .padStart(4, '0')} Dispute Letter: ${reportDetails.disputeType.title}`
  const [letterSubject, setLetterSubject] = useState(letterSubjectPlaceholder)
  const [letterBody, setLetterBody] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const [isOpen, setIsOpen] = useState(false) // Dialog open state

  const router = useRouter()
  const toast = useToast()

  const saveDateTime = () => {
    if (date && time) {
      const dateTimeString = `${date}T${time}`
      const newDate = new Date(dateTimeString)
      return newDate
    }
  }

  const onSubmit = async () => {
    if (!date) {
      toast({
        title: 'Error',
        description: 'Please select a date.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      })
      return
    }

    const selectedDate = new Date(date)
    if (isNaN(selectedDate.getTime())) {
      toast({
        title: 'Error',
        description: 'Invalid date selected.',
        status: 'error',
        position: 'bottom-right',
        isClosable: true
      })
      return
    }

    const formData = {
      type: LetterNoticeType.DISPUTE,
      title: letterSubject,
      description: letterBody,
      meetDate: saveDateTime(),
      sender: reportDetails.dispute.officerAssigned,
      idToLink: reportDetails.dispute.id,
      recipient: reportDetails.dispute.personComplained
    }

    await createDisputeLetter(formData).then(async data => {
      setIsButtonClicked(true)
      console.log(data)

      const notifLetterData = {
        type: 'disputeLetter',
        recipient: reportDetails.dispute.personComplained,
        title: `#D${reportDetails.dispute.number
          .toString()
          .padStart(
            4,
            '0'
          )} Dispute Case: A complaint has been filed against you.`,
        description: `You have been reported to be involved in a ${reportDetails.disputeType.title} dispute case. Click here to view your dispute resolution meeting letter.`,
        linkToView: `/user/disputes/letters-and-notices/letter?letterId=${data.res?.id}&disputeId=${reportDetails.dispute.id}&disputeTypeId=${reportDetails.disputeType.id}`
      }

      await createNotification(notifLetterData).then(data => {
        if (data.success) {
          console.log(data.success)
        }
      })

      await updateLetterSent(reportDetails.dispute.id, true).then(
        async data => {
          console.log(data.success)

          const update = {
            step: 5,
            progress: 'Step 5: Negotiations to Resolve Dispute',
            status: ReportStatus.NEGOTIATING
          }

          await updateDispute(reportDetails.dispute.id, update).then(data => {
            console.log(data.success)
            setIsOpen(false)

            toast({
              title: `Dispute Letter sent to Complainee`,
              description: (
                <Stack spacing={0}>
                  <Text>
                    Dispute No.: #D
                    {reportDetails.dispute.number.toString().padStart(4, '0')}
                  </Text>
                  <Text>
                    Letter Recipient: {reportDetails.personComplained.firstName}{' '}
                    {reportDetails.personComplained.lastName}
                  </Text>
                </Stack>
              ),
              status: 'success',
              position: 'bottom-right',
              isClosable: true
            })

            window.location.reload()
          })
        }
      )
    })

    router.refresh()
    router.push(
      `/user/disputes/dispute-record/view-progress/${reportDetails.dispute.id}`
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          Write Dispute Letter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Write Dispute Letter</DialogTitle>
            <DialogDescription>
              Write a letter to the complainee informing them that a dispute
              case has been filed against them.
            </DialogDescription>
          </DialogHeader>
          {/* Form Content */}
          <Stack
            spacing='15px'
            my='1.5rem'
            h='300px'
            pr={3}
            overflowY='auto'
            fontFamily='font.body'
          >
            <FormControl isReadOnly as={Flex} alignItems='center'>
              <FormLabel>To:</FormLabel>
              <Input
                type='string'
                value={`${reportDetails.personComplained.firstName} ${reportDetails.personComplained.lastName}`}
                disabled
              />
            </FormControl>
            <FormControl isRequired as={Flex} alignItems='center'>
              <FormLabel>Subject:</FormLabel>
              <Input
                type='string'
                placeholder={letterSubjectPlaceholder}
                defaultValue={letterSubjectPlaceholder}
                onChange={e => setLetterSubject(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>
                Set dispute resolution meeting date and time:
              </FormLabel>
              <Flex gap={5}>
                <Input
                  type='date'
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)}
                />
                <Input type='time' onChange={e => setTime(e.target.value)} />
              </Flex>
            </FormControl>
            <FormControl isRequired>
              <Textarea
                mt={5}
                fontSize='sm'
                fontFamily='font.body'
                placeholder={'Write something to include in the letter...'}
                height='30vh'
                resize='none'
                onChange={e => setLetterBody(e.target.value)}
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
              Send Dispute Letter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
