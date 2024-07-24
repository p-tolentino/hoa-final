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
import { updateViolation, updateLetterSent } from '@/server/actions/violation'
import { createViolationLetter } from '@/server/actions/letter-notice'
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
import { LetterNoticeType, PersonalInfo, ReportStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function WriteViolationLetter ({
  reportDetails
}: {
  reportDetails: any
}) {
  const letterSubjectPlaceholder = `#V${reportDetails.violation.number
    .toString()
    .padStart(4, '0')} Violation Letter: ${reportDetails.violationType.title}`
  const [letterSubject, setLetterSubject] = useState(letterSubjectPlaceholder)
  const [letterBody, setLetterBody] = useState('')
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  useState(letterSubjectPlaceholder)

  const [isOpen, setIsOpen] = useState(false) // Dialog open state

  const router = useRouter()

  const toast = useToast()

  const onSubmit = async () => {
    setIsButtonClicked(true)
    const initialValues = {
      type: LetterNoticeType.VIOLATION,
      title: letterSubject,
      description: letterBody,
      sender: reportDetails.violation.officerAssigned,
      idToLink: reportDetails.violation.id
    }

    await reportDetails.personsInvolved.map(async (person: PersonalInfo) => {
      const formData = {
        ...initialValues,
        recipient: person.userId
      }

      await createViolationLetter(formData).then(async data => {
        console.log(data)

        const notifLetterData = {
          type: 'violationLetter',
          recipient: person.userId,
          title: `#V${reportDetails.violation.number
            .toString()
            .padStart(
              4,
              '0'
            )} Violation Case: A violation has been reported involving you.`,
          description: `You have been reported to have committed the violation: ${reportDetails.violationType.title}. Click here to view your violation letter.`,
          linkToView: `/user/violations/letters-and-notices/letter?letterId=${data.data?.res.id}&violationId=${reportDetails.violation.id}&violationTypeId=${reportDetails.violationType.id}`
        }

        createNotification(notifLetterData).then(data => {
          if (data.success) {
            console.log(data.success)
          }
        })

        await updateLetterSent(reportDetails.violation.id, true).then(
          async data => {
            console.log(data.success)

            const update = {
              step: 5,
              progress: 'Step 5: Negotiations to Appeal Violation Case',
              status: ReportStatus.NEGOTIATING
            }

            await updateViolation(reportDetails.violation.id, update).then(
              data => {
                console.log(data.success)
                setIsOpen(false)

                toast({
                  title: `Violation Letter sent to Violator`,
                  description: (
                    <Stack spacing={0}>
                      <Text>
                        Violation No.: #V
                        {reportDetails.violation.number
                          .toString()
                          .padStart(4, '0')}
                      </Text>
                      <Text>
                        Letter Recipient:{' '}
                        {reportDetails.personsInvolved[0].firstName}{' '}
                        {reportDetails.personsInvolved[0].lastName}
                      </Text>
                    </Stack>
                  ),
                  status: 'success',
                  position: 'bottom-right',
                  isClosable: true
                })

                window.location.reload()
              }
            )
          }
        )
      })
    })

    router.refresh()
    router.push(
      `/user/violations/violation-record/view-progress/${reportDetails.violation.id}`
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          Write Violation Letter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Write Violation Letter</DialogTitle>
            <DialogDescription>
              Write a letter to the alleged violator informing them that a
              violation case has been reported against them.
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
                value={`${reportDetails.personsInvolved[0].firstName} ${reportDetails.personsInvolved[0].lastName}`}
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
              <Textarea
                fontSize='sm'
                fontFamily='font.body'
                placeholder={'Write something to include in the letter...'}
                height='25vh'
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
              Send Violation Letter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
