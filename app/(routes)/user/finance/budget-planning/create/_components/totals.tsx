import { NewBudgetPlanSchema } from '@/server/schemas'
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import * as z from 'zod'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const TotalTable = () => {
  const form = useFormContext<z.infer<typeof NewBudgetPlanSchema>>()
  const selectedYear = form.watch('forYear') // This watches the `forYear` field

  const [totals, setTotals] = useState({
    totalRev: 0,
    totalExp: 0,
    totalSurplus: 0
  })

  useEffect(() => {
    const totalRev = form.getValues('cybTotalYearlyRev')
    const totalExp = form.getValues('cybTotalYearlyExp')
    const totalSurplus = totalRev - totalExp

    setTotals({
      totalRev: totalRev !== null ? totalRev : 0,
      totalExp: totalExp !== null ? totalExp : 0,
      totalSurplus: totalSurplus !== null ? totalSurplus : 0
    })
    form.setValue('cybTotalYearlySurplus', totalSurplus)
  }, [form])

  return (
    <Box w='95%' mx={3}>
      <Box textAlign='left'>
        <Table variant='simple' mb='50px' align='center'>
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
                Year Budget for {selectedYear}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr fontFamily='font.body' fontSize='md'>
              <Td px='1rem' py='0.5rem'>
                Total Yearly Revenue
              </Td>
              <Td px='1rem' py='0.5rem' textAlign='right'>
                {totals.totalRev !== null
                  ? `${formatCurrency(totals.totalRev)}`
                  : ''}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='md'>
              <Td px='1rem' py='0.5rem'>
                Total Yearly Expenses
              </Td>
              <Td px='1rem' py='0.5rem' textAlign='right'>
                {totals.totalExp !== null
                  ? `${formatCurrency(totals.totalExp)}`
                  : ''}
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
                fontSize='lg'
                fontWeight='bold'
                color={totals.totalSurplus > 0 ? 'initial' : 'red'}
              >
                {totals.totalSurplus !== null
                  ? `${formatCurrency(totals.totalSurplus)}`
                  : ''}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default TotalTable
