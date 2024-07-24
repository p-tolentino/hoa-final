'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import {
  Button,
  Flex,
  Input,
  Text,
  ButtonGroup,
  MenuButton,
  Menu,
  Box,
  MenuList,
  MenuItem,
  useToast,
  Stack
} from '@chakra-ui/react'
import ExpenseTable from './_components/expenses-table'
import RevenueTable from './_components/revenue-table'
import TotalTable from './_components/totals'

import { NewBudgetPlanSchema } from '@/server/schemas'
import { Form, FormField } from '@/components/ui/form'
import { createBudgetPlan } from '@/server/actions/budget-plan'

import BackButton from '@/components/system/BackButton'
import { ChevronDownIcon } from '@chakra-ui/icons'

type BudgetFormValues = z.infer<typeof NewBudgetPlanSchema>

export default function CreateBudgetPlan () {
  // Page Title and Description
  const pageTitle = `Create Budget Plan`
  const pageDescription = `Enter the organization's revenue and expenses by the categories below to create a budget plan.`

  const router = useRouter()
  const { update } = useSession()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  const [selectedYear, setSelectedYear] = useState('')

  // Example range of years - adjust this as needed
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i
  )

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(NewBudgetPlanSchema),
    defaultValues: {
      title: `Budget Plan for Year`,
      forYear: new Date().getFullYear(),
      cybAssocDues: 0,
      cybToll: 0,
      cybFacility: 0,
      cybConstruction: 0,
      cybCarSticker: 0,
      cybOtherRev: 0,

      cybSalariesBenefits: 0,
      cybUtilities: 0,
      cybOfficeSupplies: 0,
      cybRepairMaintenance: 0,
      cybDonations: 0,
      cybFurnituresFixtures: 0,
      cybRepresentation: 0,
      cybLegalProfessionalFees: 0,
      cybAdministrativeCosts: 0,
      cybOtherExp: 0,

      cybTotalYearlyRev: 0,
      cybTotalYearlyExp: 0,
      cybTotalYearlySurplus: 0
    }
  })

  const onSubmit = async (values: BudgetFormValues) => {
    startTransition(() => {
      createBudgetPlan(values)
        .then(data => {
          if (data.error) {
            console.log(data.error)
            toast({
              title: `Error`,
              description:
                'There is already an existing budget plan for the year.',
              status: 'success',
              position: 'bottom-right',
              isClosable: true,
              colorScheme: 'red',
              onCloseComplete: () => {
                router.push(`/user/finance/budget-planning`)
              }
            })
          }

          if (data.success) {
            update()
            setOpen(false)
            toast({
              title: `Budget Plan Created`,
              description: `Budget Plan for the Year ${values.forYear}`,
              status: 'success',
              position: 'bottom-right',
              isClosable: true
            })
            form.reset()
            router.push(`/user/finance/budget-planning`)
            console.log(data.success)
          }
        })
        .catch(error => {
          throw new Error(error)
        })
    })
  }

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Flex gap={10} mb={10}>
            {/* Budget Plan Title  */}
            <Flex alignItems='center' fontFamily='font.heading' gap={3}>
              <Text
                fontSize='md'
                fontFamily='font.heading'
                fontWeight='semibold'
                w='max-content'
              >
                Budget Plan Title:
              </Text>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <Input
                    w='30vw'
                    type='string'
                    size='sm'
                    fontSize='md'
                    fontWeight='semibold'
                    placeholder={`${
                      selectedYear === '' ? '[Year]' : selectedYear
                    } Budget Plan`}
                    {...field}
                  />
                )}
              />
            </Flex>

            {/* Budget Plan Duration */}
            <Flex alignItems='center' fontFamily='font.heading' gap={3}>
              <Text
                fontSize='md'
                fontFamily='font.heading'
                fontWeight='semibold'
                w='max-content'
              >
                Budget Plan for the Year:
              </Text>
              <Box>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    size='sm'
                    variant='outline'
                    w='15vw'
                    textAlign='left'
                    fontSize='md'
                  >
                    {selectedYear || 'Select year'}
                  </MenuButton>
                  <MenuList maxHeight='300px' overflowY='auto'>
                    {years.map(year => (
                      <MenuItem
                        key={year}
                        onClick={() => {
                          setSelectedYear(year.toString())
                          form.setValue('forYear', year)
                        }}
                      >
                        {year}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
            </Flex>
          </Flex>

          {/* Budget Planning Table */}
          <Stack spacing={10}>
            <RevenueTable />
            <ExpenseTable />
            <TotalTable />
          </Stack>

          <div className='text-center'>
            {/* Save Button */}
            <Button size='sm' colorScheme='yellow' type='submit'>
              Save Budget Plan
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
