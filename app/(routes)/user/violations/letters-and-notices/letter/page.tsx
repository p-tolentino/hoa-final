'use client'

import {
  Box,
  Text,
  Stack,
  Flex,
  UnorderedList,
  ListItem,
  OrderedList,
  Spinner,
  Button,
  ButtonGroup,
  Heading
} from '@chakra-ui/react'
import Link from 'next/link'
import { format, addDays } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { getLetterById } from '@/server/data/letter-notice'
import {
  Hoa,
  Letter,
  PersonalInfo,
  Violation,
  ViolationType
} from '@prisma/client'
import { getInfoById } from '@/server/data/user-info'
import { getViolationTypeById } from '@/server/data/violation-type'
import { getViolationById } from '@/server/data/violation'
import BackButton from '@/components/system/BackButton'
import { useReactToPrint } from 'react-to-print'
import { FaFilePdf } from 'react-icons/fa'
import NextImage from 'next/image'
import SystemLogo from '@/public/HOAs.is-logo.png'

interface ViolationLetterProps {
  hoaInfo: Hoa
}

const ViolationLetter: React.FC<ViolationLetterProps> = ({ hoaInfo }) => {
  const searchParams = useSearchParams()

  const [letter, setLetter] = useState<Letter | null>()
  const [recipient, setRecipient] = useState<PersonalInfo | null>()
  const [sender, setSender] = useState<PersonalInfo | null>()
  const [violation, setViolation] = useState<Violation | null>()
  const [violationType, setViolationType] = useState<ViolationType | null>()

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(() => {
      const fetchData = async () => {
        const letterId = searchParams.get('letterId')
        const violationId = searchParams.get('violationId')
        const violationTypeId = searchParams.get('violationTypeId')

        if (letterId) {
          await getLetterById(letterId).then(data => {
            if (data) {
              setLetter(data)
              getInfoById(data.recipient).then(data => {
                setRecipient(data)
              })

              getInfoById(data.sender).then(data => {
                setSender(data)
              })
            }
          })
        }

        if (violationId) {
          await getViolationById(violationId).then(data => {
            setViolation(data)
          })
        }

        if (violationTypeId) {
          await getViolationTypeById(violationTypeId).then(data => {
            setViolationType(data)
          })
        }
      }

      fetchData()
    })
  }, [])

  const withinNumDays = 14 // cam be adjusted by admin
  const deadline = letter?.createdAt
    ? format(
        addDays(new Date(letter?.createdAt), withinNumDays),
        'MMMM dd, yyyy'
      )
    : ''

  const componentPDF = useRef<HTMLDivElement | null>(null)

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null,
    documentTitle: `#V${violation?.number
      .toString()
      .padStart(4, '0')} Violation Letter`
  })

  // Report Title and Description
  const reportTitle = `#V${violation?.number
    .toString()
    .padStart(4, '0')} Violation Letter`
  const reportSubtitle = `This violation letter is addressed to ${recipient?.firstName} ${recipient?.lastName} from the Homeowners' Association.`

  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(numericAmount)
  }

  return isPending ? (
    <Flex justifyContent='center' alignItems='center' minHeight='100vh'>
      <Spinner />
    </Flex>
  ) : (
    <div>
      <Flex justifyContent='flex-end'>
        <ButtonGroup>
          <Button
            size='sm'
            variant='outline'
            colorScheme='orange'
            leftIcon={<FaFilePdf />}
            onClick={generatePDF}
          >
            Generate PDF
          </Button>
          <BackButton />
        </ButtonGroup>
      </Flex>
      <Box
        h='80vh'
        overflowY='auto'
        border='1px solid lightgrey'
        borderRadius='md'
        p={3}
        mt={5}
      >
        <Box ref={componentPDF}>
          <Stack spacing={3}>
            {/* Report Header */}
            <Flex
              bg='brand.500'
              color='brand.400'
              h='70px'
              p={2}
              gap={3}
              className='report-header'
            >
              <NextImage
                src={SystemLogo}
                alt='HOAs.is Logo'
                width={100}
                height={70}
                className='m-2'
              />
              {hoaInfo && (
                <Box m={2} lineHeight={1.1}>
                  <Text
                    fontSize='lg'
                    fontFamily='font.heading'
                    fontWeight='bold'
                  >
                    {hoaInfo?.name}
                  </Text>
                  <Flex gap={10}>
                    <Flex fontFamily='font.body' gap={3}>
                      <span>Contact Number: </span>
                      {hoaInfo?.contactNumber}
                    </Flex>
                  </Flex>
                </Box>
              )}
            </Flex>
            <Box className='report-content' alignSelf='center'>
              {/* Report Title, Subtitle, and Date */}
              <Box mt={5} mb={3}>
                <Heading
                  fontSize='xl'
                  textAlign='center'
                  fontFamily='font.heading'
                >
                  {reportTitle}
                </Heading>
                <Text
                  fontSize='md'
                  textAlign='center'
                  color='gray.600'
                  fontFamily='font.body'
                >
                  {reportSubtitle}
                </Text>
                {/* <Text
                      fontSize='sm'
                      textAlign='center'
                      color='gray.500'
                      fontFamily='font.body'
                      mt={1}
                    >
                      {reportDate}
                    </Text> */}
              </Box>

              <Stack
                spacing={5}
                fontFamily='font.body'
                fontSize='md'
                mt={7}
                mx={5}
              >
                <Flex justifyContent='space-between'>
                  {/* Recipient */}
                  <Text>
                    Dear{' '}
                    <span className='font-bold'>
                      {recipient?.firstName} {recipient?.lastName}
                    </span>
                    ,
                  </Text>
                  {/* Date Received */}
                  <Text fontWeight='bold'>
                    {letter?.createdAt
                      ? format(
                          new Date(letter?.createdAt + 'Z')
                            ?.toISOString()
                            .split('T')[0],
                          'MMMM dd, yyyy'
                        )
                      : ''}
                  </Text>
                </Flex>

                <Text textAlign='justify'>
                  We are writing to inform you that a{' '}
                  <span className='font-bold'>violation</span> has been reported
                  against you.
                </Text>

                {/* Violation Details */}
                <Box>
                  <Text textAlign='justify'>
                    Violation Details: <br />
                  </Text>
                  <UnorderedList>
                    {/* Date of Violation */}
                    <ListItem>
                      Date of Violation:{' '}
                      <span className='font-semibold'>
                        {violation?.violationDate
                          ? format(
                              new Date(violation?.violationDate)
                                ?.toISOString()
                                .split('T')[0],
                              'MMMM dd, yyyy'
                            )
                          : ''}
                      </span>
                    </ListItem>
                    {/* Violation Type */}
                    <ListItem>
                      Violation Type:{' '}
                      <span className='font-semibold'>
                        {violationType?.title}
                      </span>
                    </ListItem>
                    {/* Penalty Fee */}
                    <ListItem>
                      Penalty Fee:{' '}
                      <span className='font-semibold text-red-500'>
                        {violationType?.firstOffenseFee &&
                          formatCurrency(violationType?.firstOffenseFee)}
                      </span>
                    </ListItem>
                  </UnorderedList>
                </Box>

                {/* Letter Description */}
                <Text
                  textAlign='justify'
                  mb={2}
                  as='i'
                  color='grey'
                  fontSize='lg'
                >
                  '' {letter?.description} ''
                </Text>

                <Text textAlign='justify'>
                  Upon investigation, it has been determined that corrective
                  actions are required to address the violation. You have two
                  (2) options for resolution:
                </Text>

                <OrderedList spacing={3}>
                  <ListItem>
                    <span className='font-bold'>Payment of Penalty Fee</span>:
                    You may choose to resolve the violation by paying the
                    associated penalty fee. Payment instructions can be found in
                    the{' '}
                    <Link
                      href='/user/violations/process-guide#payPenaltyFee'
                      className='text-blue-500 hover:underline'
                    >
                      Violation Process Guide - Pay Penalty Fee{' '}
                    </Link>
                    section.
                  </ListItem>
                  <ListItem>
                    <span className='font-bold'>Appeal the Violation</span>: If
                    you would like to appeal the decision, you have the right to
                    do so. To initiate the appeal process, please follow the
                    instructinons of rectifying a violation report in the{' '}
                    <Link
                      href='/user/violations/process-guide#appealViolations'
                      className='text-blue-500 hover:underline'
                    >
                      Violation Process Guide - Appeal Violations{' '}
                    </Link>
                    section.
                  </ListItem>
                </OrderedList>

                <Text textAlign='justify'>
                  Please take immediate action to rectify the violation within{' '}
                  <span className='font-semibold'>
                    {withinNumDays.toString()} days
                  </span>{' '}
                  from the date of this notice{' '}
                  <span className='font-bold text-red-500'>({deadline})</span>.
                </Text>

                <Text textAlign='justify'>
                  Your prompt attention to this matter is crucial in maintaining
                  a positive relationship with our organization and avoiding any
                  potential consequences. We appreciate your cooperation in
                  resolving this issue promptly.
                </Text>

                <Text textAlign='justify' mt={5}>
                  Sincerely,
                </Text>
                {/* Sender's Name and Position */}
                <Box mb={10}>
                  <Text>
                    {sender?.firstName} {sender?.lastName}
                  </Text>
                  <Text color='grey'>{sender?.committee}</Text>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  )
}

export default ViolationLetter
