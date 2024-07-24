import React from 'react'
import { Hoa } from '@prisma/client'
import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Heading,
  Box,
  Stack,
  Text,
  Flex
} from '@chakra-ui/react'
import NextImage from 'next/image'
import SystemLogo from '@/public/HOAs.is-logo.png'
import { format } from 'date-fns'

interface TableColumn {
  header: string
  accessor: string
}

interface PDFTableProps<T> {
  reportTitle: string
  reportSubtitle: string
  columns: TableColumn[]
  data: any[]
  hoaInfo: Hoa
  funds?: number
}

export default function PDFTable<T> ({
  reportTitle,
  reportSubtitle,
  columns,
  data,
  hoaInfo
}: PDFTableProps<T>) {
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
    <>
      <Box overflow='hidden'>
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
              <Text fontSize='lg' fontFamily='font.heading' fontWeight='bold'>
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
                fontSize='sm'
                textAlign='center'
                color='gray.600'
                fontFamily='font.body'
              >
                {reportSubtitle}
              </Text>
              <Text
                fontSize='xs'
                textAlign='center'
                color='gray.500'
                fontFamily='font.body'
                mt={1}
              >
                Date Generated: {currentDate}
              </Text>
            </Box>

            {/* Data Table */}
            <Table variant='simple' fontFamily='font.body' mt={5}>
              <Thead bg='gray.100'>
                <Tr>
                  {columns.map(column => (
                    <Th
                      key={column.accessor}
                      fontSize='sm'
                      fontWeight='bold'
                      minW={
                        column.accessor === 'amount' ||
                        column.accessor === 'reservationFee'
                          ? '150px'
                          : 'min-content'
                      }
                      textAlign={
                        column.header === 'Amount' ||
                        column.header === 'reservationFee'
                          ? 'right'
                          : 'initial'
                      }
                    >
                      {column.header}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, index) => (
                  <Tr key={index} _even={{ backgroundColor: 'gray.50' }}>
                    {columns.map(column => (
                      <Td
                        key={column.accessor}
                        fontSize='sm'
                        color={
                          item[column.accessor] === '' ||
                          item[column.accessor] === 'UNSETTLED'
                            ? 'grey'
                            : 'initial'
                        }
                        fontStyle={
                          item[column.accessor] === '' ||
                          item[column.accessor] === 'UNSETTLED'
                            ? 'italic'
                            : 'normal'
                        }
                        minW={
                          column.accessor === 'amount' ||
                          column.accessor === 'reservationFee' ||
                          column.accessor.includes('date') ||
                          column.accessor.includes('Date') ||
                          column.accessor === 'createdAt'
                            ? '150px'
                            : 'min-content'
                        }
                        textAlign={
                          column.accessor === 'amount' ||
                          column.accessor === 'reservationFee'
                            ? 'right'
                            : 'initial'
                        }
                      >
                        {column.accessor === 'status' && item.reasonToClose ? (
                          <>
                            {item.status} <br /> ({item.reasonToClose})
                          </>
                        ) : column.accessor === 'number' ? (
                          reportTitle.includes('Violation') ? (
                            `#V${item.number.toString().padStart(4, '0')}`
                          ) : reportTitle.includes('Dispute') ? (
                            `#D${item.number.toString().padStart(4, '0')}`
                          ) : (
                            `#M${item.number.toString().padStart(4, '0')}`
                          )
                        ) : column.accessor === 'amount' ? (
                          `${formatCurrency(item.amount)}`
                        ) : column.accessor === 'reservationFee' ? (
                          `${formatCurrency(item.reservationFee)}`
                        ) : item[column.accessor] === '' ||
                          item[column.accessor] === 'UNSETTLED' ? (
                          'N/A'
                        ) : column.accessor.includes('date') ||
                          column.accessor.includes('Date') ||
                          column.accessor === 'createdAt' ? (
                          `${format(item[column.accessor], 'dd MMM yyyy')}`
                        ) : (
                          item[column.accessor]
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Stack>
      </Box>
    </>
  )
}
