import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Text,
  Box
} from '@chakra-ui/react'
import { BudgetPlan } from '@prisma/client'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const ViewRevenueTable = ({
  plan,
  previous
}: {
  plan: BudgetPlan | null
  previous: BudgetPlan | null
}) => {
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
                w='max-content'
                textAlign='right'
              >
                Year Budget for {plan?.forYear}
              </Th>
              <Th
                p='1rem'
                fontFamily='font.heading'
                w='max-content'
                textAlign='right'
              >
                Year to Date Actuals (YTD-A)
              </Th>
              <Th
                p='1rem'
                fontFamily='font.heading'
                w='max-content'
                textAlign='right'
              >
                Difference
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Association Dues</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybAssocDues
                  ? `${formatCurrency(plan?.cybAssocDues)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaAssocDues
                  ? `${formatCurrency(plan?.ytdaAssocDues)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaAssocDues
                  ? `${formatCurrency(
                      plan?.cybAssocDues - plan?.ytdaAssocDues
                    )}`
                  : `${formatCurrency(plan?.cybAssocDues!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Toll Fees</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybToll
                  ? `${formatCurrency(plan?.cybToll)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaToll
                  ? `${formatCurrency(plan?.ytdaToll)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaToll
                  ? `${formatCurrency(plan?.cybToll - plan?.ytdaToll)}`
                  : `${formatCurrency(plan?.cybToll!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Facility Rentals</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybFacility
                  ? `${formatCurrency(plan?.cybFacility)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaFacility
                  ? `${formatCurrency(plan?.ytdaFacility)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaFacility
                  ? `${formatCurrency(plan?.cybFacility - plan?.ytdaFacility)}`
                  : `${formatCurrency(plan?.cybFacility!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Renovation and Demolition Fees</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybConstruction
                  ? `${formatCurrency(plan?.cybConstruction)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaConstruction
                  ? `${formatCurrency(plan?.ytdaConstruction)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaConstruction
                  ? `${formatCurrency(
                      plan?.cybConstruction - plan?.ytdaConstruction
                    )}`
                  : `${formatCurrency(plan?.cybConstruction!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Car Sticker Receipts</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybCarSticker
                  ? `${formatCurrency(plan?.cybCarSticker)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaCarSticker
                  ? `${formatCurrency(plan?.ytdaCarSticker)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaCarSticker
                  ? `${formatCurrency(
                      plan?.cybCarSticker - plan?.ytdaCarSticker
                    )}`
                  : `${formatCurrency(plan?.cybCarSticker!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Other Revenues</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybOtherRev
                  ? `${formatCurrency(plan?.cybOtherRev)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaOtherRev
                  ? `${formatCurrency(plan?.ytdaOtherRev)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaOtherRev
                  ? `${formatCurrency(plan?.cybOtherRev - plan?.ytdaOtherRev)}`
                  : `${formatCurrency(plan?.cybOtherRev!!)}`}
              </Td>
            </Tr>
            <Tr h='3rem' fontFamily='font.body' bg='brand.400'>
              <Td px='1rem' textTransform='uppercase' fontWeight='bold'>
                Total Yearly Revenue
              </Td>
              <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                {plan?.cybTotalYearlyRev
                  ? `${formatCurrency(plan?.cybTotalYearlyRev)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                {plan?.ytdaTotalYearlyRev
                  ? `${formatCurrency(plan?.ytdaTotalYearlyRev)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                {plan?.ytdaTotalYearlyRev
                  ? `${formatCurrency(
                      plan?.cybTotalYearlyRev - plan?.ytdaTotalYearlyRev
                    )}`
                  : `${formatCurrency(plan?.cybTotalYearlyRev!!)}`}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    </Box>
  )
}

export default ViewRevenueTable
