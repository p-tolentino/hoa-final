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
import { createViolationNotice } from '@/server/actions/letter-notice'
import { createNotification } from '@/server/actions/notification'
import { newUserTransaction } from '@/server/actions/user-transactions'
import { updateViolation } from '@/server/actions/violation'
import { getSoaByDate } from '@/server/data/soa'
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast
} from '@chakra-ui/react'
import {
  LetterNoticeType,
  PersonalInfo,
  ReportStatus,
  Violation
} from '@prisma/client'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function WriteFinalAssessment ({
  reportDetails
}: {
  reportDetails: any
}) {
  const [isOpen, setIsOpen] = useState(false) // Dialog open state
  const [selectedOption, setSelectedOption] = useState('')
  const [finalReview, setFinalReview] = useState('')
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const router = useRouter()
  const toast = useToast()

  const handleRadioChange = (value: string) => {
    setSelectedOption(value)
  }

  const onSubmit = async () => {
    setIsButtonClicked(true)
    const offenseCount =
      reportDetails.violationRecord[reportDetails.personsInvolved[0].userId]

    const feeToIncur =
      offenseCount === 0
        ? reportDetails.violationType.firstOffenseFee
        : offenseCount === 1
        ? reportDetails.violationType.secondOffenseFee
        : reportDetails.violationType.thirdOffenseFee

    if (selectedOption === 'CONCLUDED') {
      reportDetails.personsInvolved.map(async (person: PersonalInfo) => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        const existingCurrMonthSoa = await getSoaByDate(
          today.getFullYear(),
          today.getMonth(),
          reportDetails.personsInvolved[0].address
        )

        // Send Notice
        const noticeData = {
          type: LetterNoticeType.VIOLATION,
          title: 'title',
          description: 'body',
          sender: reportDetails.violation.officerAssigned,
          idToLink: reportDetails.violation.id,
          recipient: person.userId
        }

        await createViolationNotice(noticeData).then(async res => {
          if (res.success) {
            console.log(res.success)
            const notifNoticeData = {
              type: 'violation',
              recipient: person.userId,
              title: `#V${reportDetails.violation.number
                .toString()
                .padStart(4, '0')} Violation Case: ${selectedOption}`,
              description: `The ${reportDetails.violationType.title} violation case has been concluded. Click here to view its progress details.`,
              linkToView: `/user/violations/letters-and-notices/notice?noticeId=${res.data.res.id}&violationId=${noticeData.idToLink}&violationTypeId=${reportDetails.violationType.id}`
            }

            await createNotification(notifNoticeData).then(data => {
              if (data.success) {
                console.log(data.success)
              }
            })
          }
        })

        // Bill to Address of Person Involved + Notification
        const feeData = {
          soaId: existingCurrMonthSoa?.id || null,
          purpose: 'Violation Fines',
          amount: feeToIncur,
          addressId: reportDetails.userInfos?.find(
            (info: PersonalInfo) => info.userId === person.userId
          )?.address,
          description: `[${format(new Date(), 'dd MMM yyyy')}] ${
            reportDetails.violationType.title
          }`
        }

        await newUserTransaction(feeData).then(data => {
          if (data.success) {
            console.log(data.success)
          }
        })

        // Send Notifications
        const notifPaymentData = {
          type: 'finance',
          recipient: person.userId,
          title: `#V${reportDetails.violation.number
            .toString()
            .padStart(4, '0')} Violation Case: Violation Fine Payment Required`,
          description: `The ${reportDetails.violationType.title} violation case has been concluded, and a violation fine must be paid. Click here to view your SOA and proceed to payment.`,
          linkToView: `/user/finance/statement-of-account`
        }

        await createNotification(notifPaymentData).then(data => {
          if (data.success) {
            console.log(data.success)
          }
        })
      })
    }

    const formData = {
      finalReview: finalReview,
      status: ReportStatus.CLOSED,
      reasonToClose: `${
        selectedOption === 'APPEALED'
          ? 'Appealed'
          : 'Penalty Fee Charged to SOA'
      }`,
      feeToIncur: `${
        selectedOption === 'APPEALED' ? 'N/A' : feeToIncur.toString()
      }`,
      finalReviewDate: new Date()
    }

    await updateViolation(reportDetails.violation.id, formData).then(data => {
      console.log(data.success)
      setIsOpen(false)

      toast({
        title: `Violation Case marked as ${selectedOption}`,
        description: `Violation No.: #V${reportDetails.violation.number
          .toString()
          .padStart(4, '0')}`,
        status: 'success',
        position: 'bottom-right',
        isClosable: true
      })
    })

    window.location.reload()
    router.refresh()
    router.push(
      `/user/violations/violation-record/view-progress/${reportDetails.violation.id}`
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          Write Final Assessment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>Write Final Assessment</DialogTitle>
            <DialogDescription>
              Fill out the following fields to write the final assessment
              formulated by the committee for the violation case.
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
            <Stack>
              <Text fontSize='sm' fontFamily='font.body'>
                What is the committee's final verdict for this violation case?
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
                    bg={selectedOption === 'APPEALED' ? 'yellow.100' : ''}
                  >
                    <Radio value='APPEALED' colorScheme='yellow'>
                      The violation case has been formally{' '}
                      <span className='font-bold'>APPEALED</span>. There will be
                      no imposition of penalty fees.
                    </Radio>
                  </Box>
                  <Box
                    pl='0.5rem'
                    bg={selectedOption === 'CONCLUDED' ? 'red.100' : ''}
                  >
                    <Radio value='CONCLUDED' colorScheme='red'>
                      The violation case has been formally{' '}
                      <span className='font-bold'>CONCLUDED</span>. A{' '}
                      <span className='font-semibold text-red-500'>
                        penalty fee
                      </span>{' '}
                      shall be imposed in accordance with the committee's
                      evaluation.
                    </Radio>
                  </Box>
                </Stack>
              </RadioGroup>
            </Stack>
            <Stack>
              <Textarea
                fontSize='sm'
                fontFamily='font.body'
                placeholder={
                  "Provide a brief summary of the committee's final assessment in this violation case..."
                }
                height='20vh'
                resize='none'
                onChange={e => setFinalReview(e.target.value)}
              />
            </Stack>
          </Stack>
          <DialogFooter>
            <Button
              size='sm'
              colorScheme='yellow'
              type='button'
              isLoading={isButtonClicked}
              loadingText='Closing'
              onClick={() => onSubmit()}
            >
              Finish Assessment and Close Violation Case
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
