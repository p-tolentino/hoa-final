'use client'

import { Heading } from '@/components/ui/heading'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ViolationType } from '@prisma/client'
import { useCurrentUser } from '@/hooks/use-current-user'
import BackButton from '@/components/system/BackButton'
import AddViolationButton from './AddViolationButton'
import EditViolationButton from './EditViolationButton'
import DeleteViolationButton from './DeleteViolationButton'
import {
  Stack,
  Text,
  SimpleGrid,
  HStack,
  Card,
  CardHeader,
  CardBody,
  ButtonGroup,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@chakra-ui/react'

interface ViolationListProps {
  violations: ViolationType[]
}

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const ViolationList: React.FC<ViolationListProps> = ({ violations }) => {
  // Page Title and Description
  const pageTitle = 'List of Violations'
  const pageDescription =
    "Access the consolidated list of violations that can be reported to the Homeowners' Association. Corresponding penalties for each violation type is included."

  const user = useCurrentUser()
  const router = useRouter()

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            {(user?.info.committee === 'Security Committee' ||
              user?.role === 'SUPERUSER') && <AddViolationButton />}
            <BackButton />
          </ButtonGroup>
        }
      />

      <ScrollArea className='h-[75vh] pr-5'>
        <SimpleGrid columns={{ md: 1, lg: 2 }} spacing={5} px={2}>
          {violations
            .slice()
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(violation => (
              <Card key={violation.id} pb={3}>
                <CardHeader pb='0'>
                  <HStack justifyContent='space-between' align='baseline'>
                    {/* Violation Title */}
                    <Text size='md' fontWeight='bold' fontFamily='font.heading'>
                      {violation.title}
                    </Text>
                    {(user?.info.committee === 'Security Committee' ||
                      user?.role === 'SUPERUSER') && (
                      <ButtonGroup ml={2}>
                        <EditViolationButton violation={violation} />
                        <DeleteViolationButton
                          violation={violation}
                          continueDeletion={confirmed => {
                            if (confirmed) {
                              router.refresh()
                            }
                          }}
                        />
                      </ButtonGroup>
                    )}
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Stack spacing='20px'>
                    {/* Violation Description */}
                    <Text
                      fontSize='sm'
                      fontFamily='font.body'
                      textAlign='justify'
                    >
                      {violation.description}
                    </Text>
                    {/* Violation Levels and Penalty Fees */}
                    <TableContainer mx='1rem'>
                      <Table
                        size='xs'
                        variant='simple'
                        fontFamily='font.body'
                        cellPadding={5}
                      >
                        <Thead>
                          <Tr>
                            <Th fontSize='xs' fontFamily='font.body'>
                              Violation Level
                            </Th>
                            <Th
                              fontSize='xs'
                              fontFamily='font.body'
                              textAlign='center'
                            >
                              Penalty Fee
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody fontSize='sm' fontFamily='font.body'>
                          <Tr>
                            {/* Violation Level */}
                            <Td pl='0.5rem' lineHeight={1}>
                              <span className='font-semibold'>
                                First Offense:
                              </span>
                              <br />
                              <span className='text-[10px]'>
                                Initial violation of community rules or
                                regulations.
                              </span>
                            </Td>
                            {/* Penalty Fee */}
                            <Td textAlign='right'>
                              {formatCurrency(violation?.firstOffenseFee)}
                            </Td>
                          </Tr>
                          <Tr>
                            {/* Violation Level */}
                            <Td pl='0.5rem' lineHeight={1}>
                              <span className='font-semibold'>
                                Second Offense:
                              </span>
                              <br />
                              <span className='text-[10px]'>
                                Repeated violation after a warning or previous
                                penalty.
                              </span>
                            </Td>
                            {/* Penalty Fee */}
                            <Td textAlign='right'>
                              {formatCurrency(violation?.secondOffenseFee)}
                            </Td>
                          </Tr>
                          <Tr>
                            {/* Violation Level */}
                            <Td pl='0.5rem' lineHeight={1}>
                              <span className='font-semibold'>
                                Third Offense:
                              </span>
                              <br />
                              <span className='text-[10px]'>
                                Persistent violation despite prior warnings or
                                penalties.
                              </span>
                            </Td>
                            {/* Penalty Fee */}
                            <Td textAlign='right'>
                              {formatCurrency(violation?.thirdOffenseFee)}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </CardBody>
              </Card>
            ))}
        </SimpleGrid>
      </ScrollArea>
    </>
  )
}

export default ViolationList
