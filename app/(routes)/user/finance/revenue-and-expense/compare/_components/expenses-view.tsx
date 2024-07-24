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

export const ViewExpenseTable = ({
  monthData,
  compareData
}: {
  monthData: any
  compareData: any
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
                w='300px'
                textAlign='right'
                fontSize='sm'
              >
                {monthData?.forDate}
              </Th>
              {compareData?.forDate && (
                <Th
                  p='1rem'
                  fontFamily='font.heading'
                  w='300px'
                  textAlign='right'
                  fontSize='sm'
                >
                  {compareData?.forDate}
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Salaries and Benefits
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.SalariesBenefits
                  ? `${formatCurrency(monthData?.SalariesBenefits)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.SalariesBenefits
                    ? `${formatCurrency(compareData?.SalariesBenefits)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Utilities
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.Utilities
                  ? `${formatCurrency(monthData?.Utilities)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.Utilities
                    ? `${formatCurrency(compareData?.Utilities)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Office Supplies
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.OfficeSupplies
                  ? `${formatCurrency(monthData?.OfficeSupplies)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.OfficeSupplies
                    ? `${formatCurrency(compareData?.OfficeSupplies)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Repair and Maintenance
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.RepairMaintenance
                  ? `${formatCurrency(monthData?.RepairMaintenance)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.RepairMaintenance
                    ? `${formatCurrency(compareData?.RepairMaintenance)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Donations
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.Donations
                  ? `${formatCurrency(monthData?.Donations)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.Donations
                    ? `${formatCurrency(compareData?.Donations)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Furnitures and Fixtures
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.FurnituresFixtures
                  ? `${formatCurrency(monthData?.FurnituresFixtures)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.FurnituresFixtures
                    ? `${formatCurrency(compareData?.FurnituresFixtures)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Representation Expenses
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.Representation
                  ? `${formatCurrency(monthData?.Representation)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.Representation
                    ? `${formatCurrency(compareData?.Representation)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Legal & Professional Fees
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.LegalProfessionalFees
                  ? `${formatCurrency(monthData?.LegalProfessionalFees)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.LegalProfessionalFees
                    ? `${formatCurrency(compareData?.LegalProfessionalFees)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Administrative Costs
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.AdministrativeCosts
                  ? `${formatCurrency(monthData?.AdministrativeCosts)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.AdministrativeCosts
                    ? `${formatCurrency(compareData?.AdministrativeCosts)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr fontFamily='font.body' fontSize='sm'>
              <Td w='max-content' px='1rem'>
                Other Expenses
              </Td>
              <Td px='2rem' textAlign='right'>
                {monthData?.OtherExp
                  ? `${formatCurrency(monthData?.OtherExp)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right'>
                  {compareData?.OtherExp
                    ? `${formatCurrency(compareData?.OtherExp)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
            <Tr h='3rem' fontFamily='font.body' bg='brand.400'>
              <Td
                w='max-content'
                px='1rem'
                textTransform='uppercase'
                fontWeight='bold'
              >
                Total Expenses
              </Td>
              <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                {monthData?.TotalYearlyExp
                  ? `${formatCurrency(monthData?.TotalYearlyExp)}`
                  : `${formatCurrency(0)}`}
              </Td>
              {compareData?.forDate && (
                <Td px='2rem' textAlign='right' fontSize='md' fontWeight='bold'>
                  {compareData?.TotalYearlyExp
                    ? `${formatCurrency(compareData?.TotalYearlyExp)}`
                    : `${formatCurrency(0)}`}
                </Td>
              )}
            </Tr>
          </Tbody>
        </Table>
      </VStack>
    </Box>
  )
}

export default ViewExpenseTable
