'use client'

import { Heading } from '@/components/ui/heading'
import { SimpleGrid } from '@chakra-ui/react'
import ModuleMenuCard from '@/components/system/ModuleMenuCard'

export default function FinanceMenu () {
  // Page Title and Description
  const pageTitle = 'Finance Management'
  const pageDescription = `Navigate the ${pageTitle} module.`

  const homeownerTransactionsMenuCard = [
    {
      category: 'Homeowner Transactions',
      // category_users: 'Admins, Association Officers, and Board of Directors',
      category_buttons: [
        {
          text: "Homeowners' Transaction Record",
          href: '/user/finance/homeowners-transaction-record',
          description: `Access the transaction records of all homeowners in the Homeowners' Association.`
        }
      ],
      officerRequired: true
    }
  ]

  const fundManagementMenuCard = [
    {
      category: 'Fund Management',
      category_users: 'Association Treasurer & Finance Committee',
      category_buttons: [
        {
          text: 'Revenue & Expense Management',
          href: '/user/finance/revenue-and-expense',
          description:
            "Manage the revenues and expenses in the Homeowners' Association."
        },
        {
          text: 'Budget Planning',
          href: '/user/finance/budget-planning',
          description: `Create and access budget plans of the Homeowners' Association.`
        },
        {
          text: 'HOA Financial Reports',
          href: '/user/finance/financial-reports',
          description: `Generate and access financial reports of the Homeowners' Association.`
        }
      ],
      officerRequired: false
    }
  ]

  const yourFinancesMenuCard = [
    {
      category: 'Your Finances',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Statement of Account',
          href: '/user/finance/statement-of-account',
          description:
            "Access your statement of account to the Homeowners' Association."
        },
        {
          text: 'Payment History',
          href: '/user/finance/payment-history',
          description:
            "Access you payment history to the Homeowners' Association."
        }
      ]
    }
  ]

  return (
    <>
      <Heading title={pageTitle} description={pageDescription} />

      <SimpleGrid spacing={6} columns={{ md: 1, lg: 3 }} w='max-content'>
        {/* Homeowner Transactions */}
        {homeownerTransactionsMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* Fund Management */}
        {fundManagementMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* Your Finances */}
        {yourFinancesMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
      </SimpleGrid>
    </>
  )
}
