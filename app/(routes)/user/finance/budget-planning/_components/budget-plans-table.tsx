'use client'

import { Heading } from '@/components/ui/heading'
import { AddIcon } from '@chakra-ui/icons'
import { DataTable } from '@/components/ui/data-table'
import { useCurrentUser } from '@/hooks/use-current-user'
import { BudgetPlanColumn, columns } from './columns'
import Link from 'next/link'
import BackButton from '@/components/system/BackButton'
import { Button, Flex, Text, ButtonGroup, Box } from '@chakra-ui/react'

export const BudgetPlanning = ({
  budgetPlans
}: {
  budgetPlans: BudgetPlanColumn[]
}) => {
  // Page Title and Description
  const pageTitle = `Budget Planning`
  const pageDescription = `Create budget plans of the Homeowners' Association.`

  const user = useCurrentUser()
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

      {/* Top Section */}
      <Flex justifyContent='space-between' alignItems='flex-end' mb={5}>
        <Box>
          {/* Section Title */}
          <Text fontSize='xl' fontFamily='font.heading' fontWeight='bold'>
            Budget Plans
          </Text>
        </Box>
        {/* Create Button */}
        {user?.info?.position !== 'Member' && (
          <Button
            size='sm'
            colorScheme='yellow'
            as={Link}
            href='/user/finance/budget-planning/create'
          >
            <AddIcon mr='10px' boxSize={3} />
            <Text fontSize='sm'>Create Budget Plan</Text>
          </Button>
        )}
      </Flex>

      {/* Data Table */}
      <DataTable columns={columns} data={budgetPlans} searchKey='title' />
    </>
  )
}

export default BudgetPlanning
