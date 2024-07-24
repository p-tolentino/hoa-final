import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Box,
  UnorderedList,
  ListItem,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Tr,
  useSteps,
  Stack,
  Center,
  Divider,
  Link,
  Spinner,
  OrderedList
} from '@chakra-ui/react'
import { format } from 'date-fns'
import {
  Letter,
  PersonalInfo,
  UserRole,
  ViolationOfficerActivity,
  ViolationProgress
} from '@prisma/client'
import WriteReviewResults from './write-review-results'
import ViewProgressReport from './view-progress-report'
import ProgressReportForm from './progress-report-form'
import ViewReviewResults from './view-review-results'
import WriteViolationLetter from './write-violation-letter'
import WriteFinalAssessment from './write-final-assessment'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useEffect, useState } from 'react'
import { getLetterByViolationId } from '@/server/data/letter-notice'

interface ProcessStep {
  value: string
  title: string
  description: string
  details: string[]
}

interface StepCardProps {
  stepIndex: number
  processSteps: ProcessStep[]
  reportDetails: any
}

export default function StepCard ({
  stepIndex,
  processSteps,
  reportDetails
}: StepCardProps) {
  const user = useCurrentUser()
  const { activeStep } = useSteps({
    index: 0,
    count: reportDetails.officerActivities.length
  })

  const [letter, setLetter] = useState<Letter | null | undefined>()

  useEffect(() => {
    try {
      getLetterByViolationId(reportDetails.violation.id).then(letter => {
        if (letter) {
          setLetter(letter)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [stepIndex])

  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(numericAmount)
  }

  return (
    <Card shadow='lg' my='1.5rem' h='62vh' p='10px 10px 20px 10px'>
      <CardHeader pb={0}>
        <Text
          fontSize='sm'
          fontFamily='font.body'
          color='brand.500'
          fontWeight='bold'
        >
          Step {stepIndex + 1}
        </Text>
        <Text fontSize='lg' fontFamily='font.heading' fontWeight='bold'>
          {/* Step Title */}
          {processSteps[stepIndex].title}
        </Text>
        <Text fontFamily='font.body' textAlign='justify'>
          {/* Step Description */}
          {processSteps[stepIndex].description}
        </Text>
        <Divider mt='0.5rem' />
      </CardHeader>
      <CardBody pt={2}>
        <Box overflowY='auto' h='42vh' pb={3}>
          <Box
            fontFamily='font.body'
            fontSize='sm'
            textAlign='justify'
            mb='2rem'
          >
            {/* Step Details */}
            <Text>Details:</Text>
            <UnorderedList mb='1rem' ml={7}>
              {processSteps[stepIndex].details.map((detail, index) => (
                <ListItem key={index}>{detail}</ListItem>
              ))}
            </UnorderedList>
          </Box>

          {/* Step 1 Content */}
          {stepIndex === 0 && (
            <Box pb={5}>
              <Box>
                <Text
                  fontWeight='semibold'
                  fontFamily='font.heading'
                  lineHeight={1}
                >
                  Violation Form Contents
                </Text>
                <Text fontFamily='font.body' fontSize='sm' color='grey'>
                  Date received:{' '}
                  {reportDetails.violation.createdAt
                    ? format(
                        new Date(reportDetails.violation.createdAt + 'Z')
                          ?.toISOString()
                          .split('T')[0],
                        'dd MMM yyyy'
                      )
                    : ''}
                </Text>
              </Box>
              <Flex gap={5} pt='1rem'>
                <TableContainer>
                  <Table
                    variant='unstyled'
                    fontFamily='font.body'
                    size='sm'
                    w='400px'
                  >
                    <Tbody>
                      <Tr whiteSpace='normal'>
                        <Th border='3px double black' w='150px'>
                          Violation Case No.
                        </Th>
                        <Td border='3px double black'>
                          #V
                          {reportDetails.violation.number
                            .toString()
                            .padStart(4, '0')}
                        </Td>
                      </Tr>
                      <Tr whiteSpace='normal'>
                        <Th border='3px double black' w='150px'>
                          Violation Type
                        </Th>
                        <Td border='3px double black'>
                          {reportDetails.violationType.title}
                        </Td>
                      </Tr>
                      <Tr whiteSpace='normal'>
                        <Th border='3px double black' w='150px'>
                          Submitted By
                        </Th>
                        <Td border='3px double black'>
                          {reportDetails.submittedBy
                            ? `${reportDetails.submittedBy.firstName} ${reportDetails.submittedBy.lastName}`
                            : ''}
                        </Td>
                      </Tr>
                      <Tr whiteSpace='normal'>
                        <Th border='3px double black' w='150px'>
                          Violator
                        </Th>
                        <Td border='3px double black'>
                          <>
                            {reportDetails.personsInvolved[0].firstName}{' '}
                            {reportDetails.personsInvolved[0].lastName}
                          </>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer>
                  <Table
                    variant='unstyled'
                    fontFamily='font.body'
                    size='sm'
                    minWidth='400px'
                  >
                    <Tbody>
                      <>
                        <Tr whiteSpace='normal'>
                          <Th border='3px double black' w='150px'>
                            Date Submitted
                          </Th>
                          <Td border='3px double black'>
                            {reportDetails.violation.createdAt
                              ? format(
                                  new Date(
                                    reportDetails.violation.createdAt + 'Z'
                                  )
                                    ?.toISOString()
                                    .split('T')[0],
                                  'dd MMM yyyy'
                                )
                              : ''}
                          </Td>
                        </Tr>
                        <Tr whiteSpace='normal'>
                          <Th border='3px double black' w='150px'>
                            Date of Violation
                          </Th>
                          <Td border='3px double black'>
                            {reportDetails.violation.violationDate
                              ? format(
                                  new Date(
                                    reportDetails.violation.violationDate + 'Z'
                                  )
                                    ?.toISOString()
                                    .split('T')[0],
                                  'dd MMM yyyy'
                                )
                              : ''}
                          </Td>
                        </Tr>
                        <Tr whiteSpace='normal'>
                          <Th border='3px double black' w='150px'>
                            Supporting Documents
                          </Th>
                          <Td
                            border='3px double black'
                            color={
                              reportDetails.violation.documents.length
                                ? 'black'
                                : 'lightgrey'
                            }
                            fontStyle={
                              reportDetails.violation.documents.length
                                ? 'initial'
                                : 'italic'
                            }
                          >
                            {reportDetails.violation.documents.length ? (
                              <UnorderedList>
                                {reportDetails.violation.documents.map(
                                  (document: string, index: number) => (
                                    <ListItem key={index}>
                                      <Link
                                        href={document}
                                        target='_blank'
                                        color='blue.600'
                                      >
                                        <>
                                          Supporting Document {index + 1} (.
                                          {document.includes('.pdf')
                                            ? 'pdf'
                                            : 'png'}
                                          )
                                        </>
                                      </Link>
                                    </ListItem>
                                  )
                                )}
                              </UnorderedList>
                            ) : (
                              'N/A'
                            )}
                          </Td>
                        </Tr>
                      </>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Flex>
              <TableContainer>
                <Table
                  variant='unstyled'
                  fontFamily='font.body'
                  size='sm'
                  w='820px'
                  mt={5}
                >
                  <Tbody>
                    <Tr whiteSpace='normal'>
                      <Th border='3px double black' textAlign='center'>
                        Violation Form Description
                      </Th>
                    </Tr>
                    <Tr whiteSpace='normal'>
                      <Td
                        border='3px double black'
                        fontSize='xs'
                        textAlign='justify'
                      >
                        {reportDetails.violation.description}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Step 2 Content */}
          {stepIndex === 1 && (
            <Box>
              {reportDetails.violation.committeeReview ? (
                <ViewReviewResults
                  activeStep={activeStep}
                  reportDetails={reportDetails}
                />
              ) : (
                <Box
                  h='24vh'
                  border='1px solid lightgray'
                  borderRadius={5}
                  p={3}
                  overflowY='auto'
                  flex={3}
                >
                  {(user?.role === UserRole.SUPERUSER ||
                    user?.info.committee === 'Security Committee') && (
                    <WriteReviewResults
                      violation={reportDetails.violation}
                      committee={reportDetails.committee}
                      reportDetails={reportDetails}
                    />
                  )}
                  <Center color='gray' h='50%' fontFamily='font.body'>
                    No results to show.
                  </Center>
                </Box>
              )}
            </Box>
          )}

          {/* Step 3 Content */}
          {stepIndex === 2 && (
            <Box>
              <Box>
                <Text
                  fontWeight='semibold'
                  fontFamily='font.heading'
                  lineHeight={1}
                >
                  Officer Assigned
                </Text>
                <Text fontFamily='font.body' fontSize='sm' color='grey'>
                  Date assigned:{' '}
                  {reportDetails.violation.commReviewDate
                    ? format(
                        new Date(reportDetails.violation.commReviewDate + 'Z')
                          ?.toISOString()
                          .split('T')[0],
                        'dd MMM yyyy'
                      )
                    : ''}
                </Text>
              </Box>
              <Stack w='400px' spacing='0.5rem' pt='1rem'>
                <TableContainer>
                  <Table
                    variant='unstyled'
                    fontFamily='font.body'
                    size='sm'
                    w='400px'
                  >
                    <Tbody>
                      <Tr whiteSpace='normal'>
                        <Th border='3px double black' w='110px'>
                          Officer Assigned
                        </Th>
                        <Td
                          border='3px double black'
                          color={
                            reportDetails.officerAssigned
                              ? 'black'
                              : 'lightgray'
                          }
                          fontStyle={
                            reportDetails.officerAssigned ? 'normal' : 'italic'
                          }
                        >
                          {reportDetails.officerAssigned
                            ? `${reportDetails.officerAssigned.firstName} ${reportDetails.officerAssigned.lastName}`
                            : 'Unassigned'}
                        </Td>
                      </Tr>
                      {reportDetails.violation.priority && (
                        <Tr whiteSpace='normal'>
                          <Th border='3px double black' w='110px'>
                            Case Priority
                          </Th>
                          <Td
                            border='3px double black'
                            color={
                              reportDetails.priority === 'HIGH'
                                ? 'red'
                                : 'MEDIUM'
                                ? 'orange'
                                : 'LOW'
                                ? 'yellow'
                                : ''
                            }
                          >
                            {reportDetails.priority
                              ? `${reportDetails.priority}`
                              : 'N/A'}
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Text fontSize='xs' fontFamily='font.body' textAlign='justify'>
                  This officer has been assigned to oversee this case
                  exclusively. They are the sole authorized individual to
                  provide progress reports regarding this case.
                </Text>
              </Stack>
            </Box>
          )}

          {/* Step 4 Content */}
          {stepIndex === 3 && (
            <Box>
              {reportDetails.violation.letterSent ? (
                letter ? (
                  <Box pb={5}>
                    <Box>
                      <Text
                        fontWeight='semibold'
                        fontFamily='font.heading'
                        lineHeight={1}
                      >
                        Violation Letter Contents
                      </Text>
                      <Text fontFamily='font.body' fontSize='sm' color='grey'>
                        Date sent:{' '}
                        {letter &&
                          format(
                            new Date(letter.createdAt + 'Z')
                              ?.toISOString()
                              .split('T')[0],
                            'dd MMM yyyy'
                          )}
                      </Text>
                    </Box>
                    <Flex gap={5} pt='1rem'>
                      <TableContainer>
                        <Table
                          variant='unstyled'
                          fontFamily='font.body'
                          size='sm'
                          minWidth='400px'
                        >
                          <Tbody>
                            <Tr whiteSpace='normal'>
                              <Th border='3px double black' w='180px'>
                                Date of Letter sent
                              </Th>
                              <Td border='3px double black'>
                                {letter &&
                                  format(
                                    new Date(letter.createdAt + 'Z')
                                      ?.toISOString()
                                      .split('T')[0],
                                    'dd MMM yyyy'
                                  )}
                              </Td>
                            </Tr>
                            <Tr whiteSpace='normal'>
                              <Th border='3px double black' w='180px'>
                                Sender
                              </Th>
                              <Td border='3px double black'>
                                {reportDetails.officerAssigned
                                  ? `${reportDetails.officerAssigned.firstName} ${reportDetails.officerAssigned.lastName}`
                                  : ''}
                              </Td>
                            </Tr>
                            <Tr whiteSpace='normal'>
                              <Th border='3px double black' w='180px'>
                                Recipient
                              </Th>
                              <Td border='3px double black'>
                                {reportDetails.personsInvolved && (
                                  <>
                                    {reportDetails.personsInvolved[0].firstName}{' '}
                                    {reportDetails.personsInvolved[0].lastName}
                                  </>
                                )}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                      <TableContainer>
                        <Table
                          variant='unstyled'
                          fontFamily='font.body'
                          size='sm'
                          w='600px'
                        >
                          <Tbody>
                            <Tr whiteSpace='normal'>
                              <Th border='3px double black' textAlign='center'>
                                Violation Letter Description
                              </Th>
                            </Tr>
                            <Tr whiteSpace='normal'>
                              <Td
                                border='3px double black'
                                fontSize='xs'
                                textAlign='justify'
                              >
                                {letter && letter.description}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Flex>
                  </Box>
                ) : (
                  <Spinner />
                )
              ) : (
                <Box
                  h='24vh'
                  border='1px solid lightgray'
                  borderRadius={5}
                  p={3}
                  overflowY='auto'
                  flex={3}
                >
                  {(user?.role === UserRole.SUPERUSER ||
                    reportDetails.violation.officerAssigned === user?.id) && (
                    <WriteViolationLetter reportDetails={reportDetails} />
                  )}
                  <Center color='gray' h='50%' fontFamily='font.body'>
                    No results to show.
                  </Center>
                </Box>
              )}
            </Box>
          )}

          {/* Step 5 Content */}
          {stepIndex === 4 && (
            <Flex gap={10} mr={5}>
              <Box>
                <Box>
                  <Text
                    fontWeight='semibold'
                    fontFamily='font.heading'
                    lineHeight={1}
                  >
                    Key Activities
                  </Text>
                  <Text fontFamily='font.body' fontSize='sm'>
                    You may click the activity title to view its progress
                    reports.
                  </Text>
                </Box>
                <Box
                  h='150px'
                  border='1px solid lightgray'
                  borderRadius={5}
                  p={3}
                  overflowY='auto'
                  mt='1rem'
                  w='520px'
                >
                  <OrderedList fontSize='sm' fontFamily='font.body' spacing={3}>
                    {reportDetails.officerActivities
                      .sort((a: any, b: any) => a.deadline - b.deadline)
                      .map((activity: ViolationOfficerActivity) => (
                        <ListItem key={activity.id}>
                          <ViewProgressReport
                            activity={activity}
                            progressReports={reportDetails.progressReports.filter(
                              (progress: ViolationProgress) =>
                                progress.activity === activity.id
                            )}
                          />
                        </ListItem>
                      ))}
                  </OrderedList>
                </Box>
              </Box>
              {/* Progress Report Form */}
              {(user?.role === UserRole.SUPERUSER ||
                reportDetails.violation.officerAssigned === user?.id) &&
                !reportDetails.officerActivities.every(
                  (activity: ViolationOfficerActivity) =>
                    activity.isDone === true
                ) &&
                reportDetails.violation.status !== 'Closed' && (
                  <ProgressReportForm
                    keyActivities={reportDetails.officerActivities}
                    reportDetails={reportDetails}
                  />
                )}
            </Flex>
          )}

          {/* Step 6 Content */}
          {stepIndex === 5 && (
            <Box>
              {reportDetails.violation.finalReview ? (
                <Flex gap={10}>
                  <Box>
                    <Text
                      fontWeight='semibold'
                      fontFamily='font.heading'
                      lineHeight={1}
                    >
                      Violation Case: Review Results
                    </Text>
                    <Text fontFamily='font.body' fontSize='sm' color='grey'>
                      Date submitted final review:{' '}
                      {reportDetails.violation.finalReviewDate
                        ? format(
                            new Date(
                              reportDetails.violation.finalReviewDate + 'Z'
                            )
                              ?.toISOString()
                              .split('T')[0],
                            'dd MMM yyyy'
                          )
                        : ''}
                    </Text>
                    <Box
                      h='18vh'
                      border='1px solid lightgray'
                      borderRadius={5}
                      p={3}
                      overflowY='auto'
                      flex={3}
                      mt='1rem'
                      w='600px'
                    >
                      <Text
                        fontFamily='font.body'
                        fontSize='sm'
                        textAlign='justify'
                      >
                        {reportDetails.violation.finalReview}
                      </Text>
                    </Box>
                  </Box>
                  <Box>
                    <Text
                      fontWeight='semibold'
                      fontFamily='font.heading'
                      lineHeight={1}
                    >
                      Violation Enforcement Information
                    </Text>
                    <Text fontFamily='font.body' fontSize='sm' color='grey'>
                      Date enforced:{' '}
                      {reportDetails.violation.finalReviewDate
                        ? format(
                            new Date(
                              reportDetails.violation.finalReviewDate + 'Z'
                            )
                              ?.toISOString()
                              .split('T')[0],
                            'dd MMM yyyy'
                          )
                        : ''}
                    </Text>

                    <Stack w='400px' spacing='0.5rem' pt='1rem'>
                      <TableContainer>
                        <Table
                          variant='unstyled'
                          fontFamily='font.body'
                          size='sm'
                          w='400px'
                        >
                          <Tbody>
                            <Tr whiteSpace='normal'>
                              <Th border='3px double black' w='150px'>
                                Violation Type
                              </Th>
                              <Td border='3px double black'>
                                {reportDetails.violationType.title}
                              </Td>
                            </Tr>
                            <Tr whiteSpace='normal'>
                              <Th border='3px double black' w='150px'>
                                Reason to Close
                              </Th>
                              <Td border='3px double black'>
                                {reportDetails.violation.reasonToClose}
                              </Td>
                            </Tr>
                            <Tr whiteSpace='normal'>
                              <Th border='3px double black' w='150px'>
                                Penalty Fee
                              </Th>
                              <Td
                                border='3px double black'
                                fontStyle={
                                  reportDetails.violation.feeToIncur !== 'N/A'
                                    ? 'initial'
                                    : 'italic'
                                }
                                color={
                                  reportDetails.violation.feeToIncur !== 'N/A'
                                    ? 'red.500'
                                    : 'lightgrey'
                                }
                              >
                                {reportDetails.violation.feeToIncur !== 'N/A'
                                  ? formatCurrency(
                                      reportDetails.violation.feeToIncur
                                    )
                                  : reportDetails.violation.feeToIncur}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </Box>
                </Flex>
              ) : (
                <Box
                  h='24vh'
                  border='1px solid lightgray'
                  borderRadius={5}
                  p={3}
                  overflowY='auto'
                  flex={3}
                >
                  {(user?.role === UserRole.SUPERUSER ||
                    reportDetails.violation.officerAssigned === user?.id) && (
                    <WriteFinalAssessment reportDetails={reportDetails} />
                  )}
                  <Center color='gray' h='50%' fontFamily='font.body'>
                    No results to show.
                  </Center>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </CardBody>
    </Card>
  )
}
