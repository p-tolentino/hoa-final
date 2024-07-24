import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react'
import { BudgetPlan } from '@prisma/client'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const ViewTotalTable = ({
  plan,
  previous
}: {
  plan: BudgetPlan | null
  previous: BudgetPlan | null
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
              w='max-content'
              fontFamily='font.heading'
              textAlign='right'
            >
              Year Budget for {plan?.forYear}
            </Th>
            <Th
              p='1rem'
              w='max-content'
              fontFamily='font.heading'
              textAlign='right'
            >
              Year to Date Actuals (YTD-A)
            </Th>
            <Th p='1rem' fontFamily='font.heading' w='200px' textAlign='right'>
              Difference
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr fontFamily='font.body' fontSize='md'>
            <Td px='1rem' py='0.5rem'>
              Total Yearly Revenue
            </Td>
            <Td px='1rem' py='0.5rem' textAlign='right'>
              {plan?.cybTotalYearlyRev
                ? `${formatCurrency(plan?.cybTotalYearlyRev)}`
                : `${formatCurrency(0)}`}
            </Td>
            <Td px='1rem' py='0.5rem' textAlign='right'>
              {plan?.ytdaTotalYearlyRev
                ? `${formatCurrency(plan?.ytdaTotalYearlyRev)}`
                : `${formatCurrency(0)}`}
            </Td>
            <Td px='1rem' py='0.5rem' textAlign='right'>
              {plan?.ytdaTotalYearlyRev
                ? `${formatCurrency(
                    plan?.cybTotalYearlyRev - plan?.ytdaTotalYearlyRev
                  )}`
                : `${formatCurrency(plan?.cybTotalYearlyRev!!)}`}
            </Td>
          </Tr>
          <Tr fontFamily='font.body' fontSize='md'>
            <Td px='1rem' py='0.5rem'>
              Total Yearly Expenses
            </Td>
            <Td px='1rem' py='0.5rem' textAlign='right'>
              {plan?.cybTotalYearlyExp
                ? `${formatCurrency(plan?.cybTotalYearlyExp)}`
                : `${formatCurrency(0)}`}
            </Td>
            <Td px='1rem' py='0.5rem' textAlign='right'>
              {plan?.ytdaTotalYearlyExp
                ? `${formatCurrency(plan?.ytdaTotalYearlyExp)}`
                : `${formatCurrency(0)}`}
            </Td>
            <Td px='1rem' py='0.5rem' textAlign='right'>
              {plan?.ytdaTotalYearlyExp
                ? `${formatCurrency(
                    plan?.cybTotalYearlyExp - plan?.ytdaTotalYearlyExp
                  )}`
                : `${formatCurrency(plan?.cybTotalYearlyExp!!)}`}
            </Td>
          </Tr>
          <Tr h='3rem' key='total' fontFamily='font.body' bg='brand.400'>
            <Td
              px='1rem'
              py='0.5rem'
              textTransform='uppercase'
              fontWeight='bold'
            >
              Total Yearly Operating Overage/Surplus
            </Td>
            <Td
              px='1rem'
              py='0.5rem'
              textAlign='right'
              fontWeight='bold'
              color={
                plan?.cybTotalYearlySurplus && plan?.cybTotalYearlySurplus > 0
                  ? 'initial'
                  : 'red'
              }
            >
              {plan?.cybTotalYearlySurplus
                ? `${formatCurrency(plan?.cybTotalYearlySurplus)}`
                : `${formatCurrency(0)}`}
            </Td>
            <Td
              px='1rem'
              py='0.5rem'
              textAlign='right'
              fontWeight='bold'
              color={
                plan?.ytdaTotalYearlySurplus && plan?.ytdaTotalYearlySurplus > 0
                  ? 'initial'
                  : 'red'
              }
            >
              {plan?.ytdaTotalYearlySurplus
                ? `${formatCurrency(plan?.ytdaTotalYearlySurplus)}`
                : `${formatCurrency(0)}`}
            </Td>
            <Td
              px='1rem'
              py='0.5rem'
              textAlign='right'
              fontWeight='bold'
              color={
                plan?.ytdaTotalYearlySurplus && plan?.ytdaTotalYearlySurplus > 0
                  ? 'initial'
                  : 'red'
              }
            >
              {plan?.ytdaTotalYearlySurplus
                ? `${formatCurrency(
                    plan?.cybTotalYearlySurplus - plan?.ytdaTotalYearlySurplus
                  )}`
                : `${formatCurrency(plan?.cybTotalYearlySurplus!!)}`}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  )
}

export default ViewTotalTable
