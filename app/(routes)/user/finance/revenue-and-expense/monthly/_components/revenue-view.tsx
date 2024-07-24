import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Box,
  Text
} from '@chakra-ui/react'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const ViewRevenueTable = ({ monthData }: { monthData: any }) => {
  return (
    <Box w='95%' mx={3}>
      <VStack>
        <Table variant='simple' size='sm'>
          <Thead bgColor='gray.100'>
            <Tr h='3rem' fontSize='xs'>
              <Th
                p='1rem'
                w='max-content'
                textTransform='uppercase'
                fontSize='lg'
                fontWeight='extrabold'
                fontFamily='font.heading'
                color='brand.500'
              >
                Revenue
              </Th>
              <Th
                p='1rem'
                fontFamily='font.heading'
                w='300px'
                textAlign='right'
              >
                {/* {monthData?.forDate} */}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Association Dues
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.AssocDues
                  ? `${formatCurrency(monthData?.Toll)}`
                  : `${formatCurrency(0)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Toll Fees
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.Toll
                  ? `${formatCurrency(monthData?.Toll)}`
                  : `${formatCurrency(0)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Facility Rentals
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.Facility
                  ? `${formatCurrency(monthData?.Facility)}`
                  : `${formatCurrency(0)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Renovation and Demolition Fees
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.Construction
                  ? `${formatCurrency(monthData?.Construction)}`
                  : `${formatCurrency(0)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Car Sticker Receipts
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.CarSticker
                  ? `${formatCurrency(monthData?.CarSticker)}`
                  : `${formatCurrency(0)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Other Revenues
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.OtherRev
                  ? `${formatCurrency(monthData?.OtherRev)}`
                  : `${formatCurrency(0)}`}
              </Td>
            </Tr>
            <Tr h='3rem' fontFamily='font.body' bg='brand.400'>
              <Td
                w='max-content'
                px='1rem'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Total Revenue
              </Td>
              <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                {monthData?.TotalYearlyRev
                  ? `${formatCurrency(monthData?.TotalYearlyRev)}`
                  : `${formatCurrency(0)}`}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    </Box>
  )
}

export default ViewRevenueTable
