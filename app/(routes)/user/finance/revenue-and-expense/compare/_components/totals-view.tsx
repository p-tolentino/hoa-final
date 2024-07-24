import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const ViewTotalTable = ({
  monthData,
  compareData
}: {
  monthData: any
  compareData: any
}) => {
  return (
    <Box w='95%' mx={3}>
      <Table variant='simple' align='center'>
        <Thead bgColor='gray.100'>
          <Tr h='2rem'>
            <Th
              p='1rem'
              w='max-content'
              textTransform='uppercase'
              fontSize='lg'
              fontWeight='extrabold'
              fontFamily='font.heading'
              color='brand.500'
            >
              Totals
            </Th>
            <Th
              p='1rem'
              w='300px'
              fontFamily='font.heading'
              textAlign='right'
              fontSize='sm'
            >
              {monthData?.forDate}
            </Th>
            {compareData?.forDate && (
              <Th
                p='1rem'
                w='300px'
                fontFamily='font.heading'
                textAlign='right'
                fontSize='sm'
              >
                {compareData?.forDate}
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          <Tr fontFamily='font.body' fontSize='md'>
            <Td px='1rem' py='0.5rem'>
              Total Revenue
            </Td>
            <Td px='1rem' py='0.5rem' textAlign='right'>
              {monthData?.TotalYearlyRev
                ? `${formatCurrency(monthData?.TotalYearlyRev)}`
                : `${formatCurrency(0)}`}
            </Td>
            {compareData?.forDate && (
              <Td px='1rem' py='0.5rem' textAlign='right'>
                {compareData?.TotalYearlyRev
                  ? `${formatCurrency(compareData?.TotalYearlyRev)}`
                  : `${formatCurrency(0)}`}
              </Td>
            )}
          </Tr>
          <Tr fontFamily='font.body' fontSize='md'>
            <Td px='1rem' py='0.5rem'>
              Total Expenses
            </Td>
            <Td px='1rem' py='0.5rem' textAlign='right'>
              {monthData?.TotalYearlyExp
                ? `${formatCurrency(monthData?.TotalYearlyExp)}`
                : `${formatCurrency(0)}`}
            </Td>
            {compareData?.forDate && (
              <Td px='1rem' py='0.5rem' textAlign='right'>
                {compareData?.TotalYearlyExp
                  ? `${formatCurrency(compareData?.TotalYearlyExp)}`
                  : `${formatCurrency(0)}`}
              </Td>
            )}
          </Tr>
          <Tr h='3rem' key='total' fontFamily='font.body' bg='brand.400'>
            <Td
              px='1rem'
              py='0.5rem'
              textTransform='uppercase'
              fontWeight='bold'
            >
              Total Operating Overage/Surplus
            </Td>
            <Td
              px='1rem'
              py='0.5rem'
              textAlign='right'
              fontWeight='bold'
              color={monthData?.TotalYearlySurplus > 0 ? 'initial' : 'red'}
            >
              {monthData?.TotalYearlySurplus
                ? `${formatCurrency(monthData?.TotalYearlySurplus)}`
                : `${formatCurrency(0)}`}
            </Td>
            {compareData?.forDate && (
              <Td
                px='1rem'
                py='0.5rem'
                textAlign='right'
                fontWeight='bold'
                color={compareData?.TotalYearlySurplus > 0 ? 'initial' : 'red'}
              >
                {compareData?.TotalYearlySurplus
                  ? `${formatCurrency(compareData?.TotalYearlySurplus)}`
                  : `${formatCurrency(0)}`}
              </Td>
            )}
          </Tr>
        </Tbody>
      </Table>
    </Box>
  )
}

export default ViewTotalTable
