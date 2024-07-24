'use client'

import React, { useEffect, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  VStack,
  Flex,
  Box,
  Text
} from '@chakra-ui/react'
import { useFormContext } from 'react-hook-form'
import { NewBudgetPlanSchema } from '@/server/schemas'
import * as z from 'zod'
import { FormField } from '@/components/ui/form'

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const ExpenseTable = () => {
  const form = useFormContext<z.infer<typeof NewBudgetPlanSchema>>()
  const [total, setTotal] = useState<number | null>(null)
  const selectedYear = form.watch('forYear') // This watches the `forYear` field

  useEffect(() => {
    const salaryBenefits =
      parseFloat(form.getValues('cybSalariesBenefits').toString()) || 0
    const utilities = parseFloat(form.getValues('cybUtilities').toString()) || 0

    const supplies =
      parseFloat(form.getValues('cybOfficeSupplies').toString()) || 0
    const maintenance =
      parseFloat(form.getValues('cybRepairMaintenance').toString()) || 0
    const donations = parseFloat(form.getValues('cybDonations').toString()) || 0
    const furnitureFixtureFees =
      parseFloat(form.getValues('cybFurnituresFixtures').toString()) || 0
    const repFee =
      parseFloat(form.getValues('cybRepresentation').toString()) || 0
    const legalFees =
      parseFloat(form.getValues('cybLegalProfessionalFees').toString()) || 0
    const adminCost =
      parseFloat(form.getValues('cybAdministrativeCosts').toString()) || 0
    const otherExp = parseFloat(form.getValues('cybOtherExp').toString()) || 0

    const totalExp =
      salaryBenefits +
      utilities +
      supplies +
      maintenance +
      donations +
      furnitureFixtureFees +
      repFee +
      legalFees +
      adminCost +
      otherExp
    setTotal(totalExp)
    form.setValue('cybTotalYearlyExp', totalExp)
  }, [
    [
      form.watch('cybSalariesBenefits'),
      form.watch('cybUtilities'),
      form.watch('cybOfficeSupplies'),
      form.watch('cybRepairMaintenance'),
      form.watch('cybDonations'),
      form.watch('cybFurnituresFixtures'),
      form.watch('cybRepresentation'),
      form.watch('cybLegalProfessionalFees'),
      form.watch('cybAdministrativeCosts'),
      form.watch('cybOtherExp')
    ]
  ])

  return (
    <Box w='95%' mx={3}>
      <Table variant='simple' size='xs'>
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
              Year Budget for {selectedYear}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Salaries and Benefits</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybSalariesBenefits'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Utilities</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybUtilities'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Office Supplies</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybOfficeSupplies'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Repair and Maintenance</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybRepairMaintenance'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Donations</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybDonations'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Furnitures and Fixtures</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybFurnituresFixtures'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>

          <Tr fontFamily='font.body'>
            <Td px='1rem'>Representation Expenses</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybRepresentation'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Legal & Professional Fees</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybLegalProfessionalFees'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Administrative Costs</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybAdministrativeCosts'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr fontFamily='font.body'>
            <Td px='1rem'>Other Expenses</Td>
            <Td px='2rem'>
              <Flex gap={2}>
                ₱
                <FormField
                  control={form.control}
                  name='cybOtherExp'
                  render={({ field }) => (
                    <Input
                      size='sm'
                      type='number'
                      min='0' // Ensures that the browser enforces a minimum value of 0
                      onChange={e => {
                        const value = parseFloat(e.target.value)
                        if (value >= 0) {
                          field.onChange(value)
                        }
                      }}
                      value={field.value}
                      textAlign='right'
                    />
                  )}
                />
              </Flex>
            </Td>
          </Tr>
          <Tr h='3rem' key='total' fontFamily='font.body' bg='brand.400'>
            <Td px='1rem' textTransform='uppercase' fontWeight='bold'>
              Total Yearly Expense
            </Td>
            <Td px='3rem' textAlign='right' fontSize='lg' fontWeight='bold'>
              {total !== null ? `${formatCurrency(total)}` : ''}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  )
}

export default ExpenseTable
