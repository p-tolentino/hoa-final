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
import { BudgetPlan } from '@prisma/client'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const ViewExpenseTable = ({
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
                Expenses
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
              <Td px='1rem'>Salaries and Benefits</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybSalariesBenefits
                  ? `${formatCurrency(plan?.cybSalariesBenefits)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaSalariesBenefits
                  ? `${formatCurrency(plan?.ytdaSalariesBenefits)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaSalariesBenefits
                  ? `${formatCurrency(
                      plan?.cybSalariesBenefits - plan?.ytdaSalariesBenefits
                    )}`
                  : `${formatCurrency(plan?.cybSalariesBenefits!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Utilities</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybUtilities
                  ? `${formatCurrency(plan?.cybUtilities)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaUtilities
                  ? `${formatCurrency(plan?.ytdaUtilities)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaUtilities
                  ? `${formatCurrency(
                      plan?.cybUtilities - plan?.ytdaUtilities
                    )}`
                  : `${formatCurrency(plan?.cybUtilities!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Office Supplies</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybOfficeSupplies
                  ? `${formatCurrency(plan?.cybOfficeSupplies)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaOfficeSupplies
                  ? `${formatCurrency(plan?.ytdaOfficeSupplies)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaOfficeSupplies
                  ? `${formatCurrency(
                      plan?.cybOfficeSupplies - plan?.ytdaOfficeSupplies
                    )}`
                  : `${formatCurrency(plan?.cybOfficeSupplies!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Repair and Maintenance</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybRepairMaintenance
                  ? `${formatCurrency(plan?.cybRepairMaintenance)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaRepairMaintenance
                  ? `${formatCurrency(plan?.ytdaRepairMaintenance)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaRepairMaintenance
                  ? `${formatCurrency(
                      plan?.cybRepairMaintenance - plan?.ytdaRepairMaintenance
                    )}`
                  : `${formatCurrency(plan?.cybRepairMaintenance!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Donations</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybDonations
                  ? `${formatCurrency(plan?.cybDonations)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaDonations
                  ? `${formatCurrency(plan?.ytdaDonations)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaDonations
                  ? `${formatCurrency(
                      plan?.cybDonations - plan?.ytdaDonations
                    )}`
                  : `${formatCurrency(plan?.cybDonations!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Furnitures and Fixtures</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybFurnituresFixtures
                  ? `${formatCurrency(plan?.cybFurnituresFixtures)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaFurnituresFixtures
                  ? `${formatCurrency(plan?.ytdaFurnituresFixtures)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaFurnituresFixtures
                  ? `${formatCurrency(
                      plan?.cybFurnituresFixtures - plan?.ytdaFurnituresFixtures
                    )}`
                  : `${formatCurrency(plan?.cybFurnituresFixtures!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Representation Expenses</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybRepresentation
                  ? `${formatCurrency(plan?.cybRepresentation)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaRepresentation
                  ? `${formatCurrency(plan?.ytdaRepresentation)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaRepresentation
                  ? `${formatCurrency(
                      plan?.cybRepresentation - plan?.ytdaRepresentation
                    )}`
                  : `${formatCurrency(plan?.cybRepresentation!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Legal & Professional Fees</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybLegalProfessionalFees
                  ? `${formatCurrency(plan?.cybLegalProfessionalFees)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaLegalProfessionalFees
                  ? `${formatCurrency(plan?.ytdaLegalProfessionalFees)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaLegalProfessionalFees
                  ? `${formatCurrency(
                      plan?.cybLegalProfessionalFees -
                        plan?.ytdaLegalProfessionalFees
                    )}`
                  : `${formatCurrency(plan?.cybLegalProfessionalFees!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Administrative Costs</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybAdministrativeCosts
                  ? `${formatCurrency(plan?.cybAdministrativeCosts)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaAdministrativeCosts
                  ? `${formatCurrency(plan?.ytdaAdministrativeCosts)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaAdministrativeCosts
                  ? `${formatCurrency(
                      plan?.cybAdministrativeCosts -
                        plan?.ytdaAdministrativeCosts
                    )}`
                  : `${formatCurrency(plan?.cybAdministrativeCosts!!)}`}
              </Td>
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td px='1rem'>Other Expenses</Td>
              <Td px='2rem' textAlign='right'>
                {plan?.cybOtherExp
                  ? `${formatCurrency(plan?.cybOtherExp)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaOtherExp
                  ? `${formatCurrency(plan?.ytdaOtherExp)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right'>
                {plan?.ytdaOtherExp
                  ? `${formatCurrency(plan?.cybOtherExp - plan?.ytdaOtherExp)}`
                  : `${formatCurrency(plan?.cybOtherExp!!)}`}
              </Td>
            </Tr>
            <Tr h='3rem' fontFamily='font.body' bg='brand.400'>
              <Td px='1rem' textTransform='uppercase' fontWeight='bold'>
                Total Yearly Expense
              </Td>
              <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                {plan?.cybTotalYearlyExp
                  ? `${formatCurrency(plan?.cybTotalYearlyExp)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                {plan?.ytdaTotalYearlyExp
                  ? `${formatCurrency(plan?.ytdaTotalYearlyExp)}`
                  : `${formatCurrency(0)}`}
              </Td>
              <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                {plan?.ytdaTotalYearlyExp
                  ? `${formatCurrency(
                      plan?.cybTotalYearlyExp - plan?.ytdaTotalYearlyExp
                    )}`
                  : `${formatCurrency(plan?.cybTotalYearlyExp!!)}`}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    </Box>
  )
}

export default ViewExpenseTable
