'use client'

import React, { useCallback, useRef, useState, useTransition } from 'react'
import { Hoa } from '@prisma/client'
import { FaFilePdf } from 'react-icons/fa'
import { useReactToPrint } from 'react-to-print'
import NextImage from 'next/image'
import SystemLogo from '@/public/HOAs.is-logo.png'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Select,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableRow
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'

interface CashFlowStatementProps {
  hoaInfo: Hoa
  finance: any
  year: string
  month: string
}

export const CashFlowStatement: React.FC<CashFlowStatementProps> = ({
  hoaInfo,
  finance,
  year,
  month
}) => {
  // Tab Title and Description
  const tabTitle = 'Cash Flow Statement'
  const tabDescription = `Access and download the ${tabTitle}s of the Homeowners' Association.`

  // Format Currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount)
  }

  // State for selected year and month
  const [selectedYear, setSelectedYear] = useState(year)
  const [selectedMonth, setSelectedMonth] = useState(month)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const handleChange = useCallback(
    (event: any, paramToSet: string) => {
      startTransition(() => {
        const selectedValue = event.target.value
        const currentUrl = new URL(window.location.href)

        // Update the search parameters
        currentUrl.searchParams.set(paramToSet, selectedValue)

        if (paramToSet === 'month') {
          setSelectedMonth(selectedValue)
        }

        if (paramToSet === 'year') {
          setSelectedYear(selectedValue)
        }
        // Use router.push to update the URL without reloading the page
        router.push(currentUrl.toString())
      })
    },
    [router]
  )

  // Array of months
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  // Function to get month name by its number
  const getMonthByNum = (numStr: string): string | undefined => {
    const num: number = parseInt(numStr, 10) // Parse string to integer with base 10

    // Check if num is a valid month index
    if (!isNaN(num) && num >= 0 && num < 11) {
      return months[num]
    } else {
      return undefined // Return undefined if num is not a valid month index
    }
  }

  // Report Title and Description
  const reportTitle = `${hoaInfo?.name}`
  const reportSubtitle = `Cash Flow Statement`
  const reportDate = `For the Month Ended ${getMonthByNum(
    selectedMonth
  )} ${selectedYear}`

  const componentPDF = useRef<HTMLDivElement | null>(null)

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null
  })

  // Sample report entries
  const reportEntries = [
    {
      category: 'Cash Inflows',
      items: [
        { title: 'Assocation Dues', amount: finance.assocDuesRevenue },
        { title: 'Toll Fees', amount: finance.tollFeesRevenue },
        {
          title: 'Facility Rentals / Reservation Fees',
          amount: finance.facilityFeesRevenue
        },
        {
          title: 'Violation Fines',
          amount: finance.violationFinesRevenue
        },
        {
          title: 'Renovation and Demolition Fees',
          amount: finance.renovDemoRevenue
        },
        {
          title: 'Car Sticker Receipts',
          amount: finance.carStickerRevenue
        },
        {
          title: 'Donations',
          amount: finance.donationsRevenue
        },

        { title: 'Other Revenues', amount: finance.otherRevenue }
      ],
      total: finance.totalRevenue
    },
    {
      category: 'Cash Outflows',
      items: [
        { title: 'Salaries and Benefits', amount: finance.salariesExpense },
        { title: 'Utilities', amount: finance.utilitiesExpense },
        { title: 'Office Supplies', amount: finance.officeSuppliesExpense },
        {
          title: 'Furnitures and Fixtures',
          amount: finance.furnituresFixturesExpense
        },
        {
          title: 'Repair and Maintenance',
          amount: finance.repairMaintenanceExpense
        },
        {
          title: 'Legal and Professional Fees',
          amount: finance.legalProfExpense
        },
        {
          title: 'Administrative Costs',
          amount: finance.administrativeExpense
        },
        {
          title: 'Miscellaneous Expenses',
          amount: finance.miscellaneousExpense
        }
      ],
      total: finance.totalExpenses
    }
  ]

  // Check if all values are 0 in finance
  const noFinanceData = Object.values(finance).every(value => value === 0)

  return (
    <Card className='h-[68vh]'>
      <Flex justifyContent='space-between' align='center'>
        <CardHeader>
          <CardTitle className='font-bold'>{tabTitle}</CardTitle>
          <CardDescription>{tabDescription}</CardDescription>
        </CardHeader>
        <ButtonGroup p={5}>
          <Button
            size='sm'
            variant='outline'
            colorScheme='orange'
            leftIcon={<FaFilePdf />}
            onClick={generatePDF}
            isDisabled={isPending || noFinanceData}
          >
            Generate PDF
          </Button>
        </ButtonGroup>
      </Flex>
      {/* Selection Filter */}
      <Flex gap={3} fontFamily='font.body' align='center' ml={7} mb={2}>
        <Text>Please select year and month:</Text>
        <Select
          size='sm'
          w='max-content'
          fontWeight='semibold'
          color='gray.500'
          value={selectedYear}
          onChange={e => handleChange(e, 'year')}
          disabled={isPending}
        >
          {Array.from({ length: 5 }).map((_, index) => {
            const year = new Date().getFullYear() - index
            return (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            )
          })}
        </Select>
        <Select
          size='sm'
          w='max-content'
          fontWeight='semibold'
          color='gray.500'
          value={selectedMonth}
          onChange={e => handleChange(e, 'month')}
          disabled={isPending}
        >
          {months.map((month, index) => (
            <option key={index} value={index.toString()}>
              {month}
            </option>
          ))}
        </Select>
      </Flex>
      <CardContent>
        {!isPending && !noFinanceData ? (
          <>
            <Box
              maxHeight='calc(70vh - 180px)'
              overflowY='auto'
              border='1px solid lightgrey'
              borderRadius='md'
              p={5}
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
                        fontSize='xl'
                        textAlign='center'
                        color='gray.600'
                        fontFamily='font.body'
                      >
                        {reportSubtitle}
                      </Text>
                      <Text
                        textAlign='center'
                        color='gray.500'
                        fontFamily='font.body'
                        mt={1}
                      >
                        {reportDate}
                      </Text>
                    </Box>

                    {/* REPORT TABLE */}
                    <Stack m={5} spacing={10}>
                      <Table>
                        <TableCaption>*** END OF REPORT ***</TableCaption>
                        <TableBody style={{ borderTop: '1px solid black' }}>
                          {reportEntries.map(entry => (
                            <React.Fragment key={entry.category}>
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  className='font-bold fit-table-padding'
                                >
                                  {entry.category}
                                </TableCell>
                              </TableRow>
                              {entry.items.map(item => (
                                <TableRow key={item.title}>
                                  <TableCell className='fit-table-padding'></TableCell>
                                  <TableCell className='font-medium fit-table-padding'>
                                    {item.title}
                                  </TableCell>
                                  <TableCell className='text-right fit-table-padding'>
                                    {formatCurrency(item.amount)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              {/* Total row for each category */}
                              <TableRow className='bg-gray-100 hover:bg-gray-200'>
                                <TableCell
                                  colSpan={2}
                                  className='font-semibold uppercase fit-table-padding'
                                >
                                  Total {entry.category}
                                </TableCell>
                                <TableCell
                                  className={`text-right font-semibold fit-table-padding ${
                                    entry.total < 0 ? 'text-red-500' : ''
                                  }`}
                                >
                                  {formatCurrency(entry.total)}
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
                          ))}
                        </TableBody>
                        <TableFooter style={{ borderTop: '3px double black' }}>
                          <TableRow className='bg-gray-200 hover:bg-gray-300'>
                            <TableCell
                              colSpan={2}
                              className='font-bold uppercase fit-table-padding'
                            >
                              Net Cash Flow from Operating Activities
                            </TableCell>
                            <TableCell
                              className={`text-right font-bold fit-table-padding ${
                                finance.netIncome <= 0 ? 'text-red-500' : ''
                              }`}
                            >
                              {formatCurrency(finance.netIncome)}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </>
        ) : (
          <Center fontFamily='font.body' color='lightgrey' pt={10} gap={2}>
            {isPending ? (
              <>
                <span>Please wait...</span>
                <Spinner />
              </>
            ) : (
              <span>No results to show.</span>
            )}
          </Center>
        )}
      </CardContent>
    </Card>
  )
}
