'use client'

import { Heading } from '@/components/ui/heading'
import { SimpleGrid } from '@chakra-ui/react'
import ModuleMenuCard from '@/components/system/ModuleMenuCard'

export default function ViolationMenu () {
  // Page Title and Description
  const pageTitle = 'Violation Monitoring'
  const pageDescription = `Navigate the ${pageTitle} module.`

  const violationManagementMenuCard = [
    {
      category: 'Violation Management',
      category_users: 'Security Committee',
      category_buttons: [
        {
          text: 'HOA Violation Record',
          href: '/user/violations/violation-record',
          description:
            "Manage the violation record in the Homeowners' Association."
        }
      ],
      officerRequired: true
    }
  ]

  const knowledgeBaseMenuCard = [
    {
      category: 'Violation Knowledge Base',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Violation Monitoring Process Guide',
          href: '/user/violations/process-guide',
          description:
            "Read more about the violation monitoring process within the Homeowners' Assocaition."
        },
        {
          text: 'List of Violations',
          href: '/user/violations/violation-list',
          description:
            "Access the consolidated list of violations that can be reported to the Homeowners' Association. Corresponding penalties for each violation type is included."
        }
      ]
    }
  ]

  const reportViolationsMenuCard = [
    {
      category: 'Report Violations',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Violation Form',
          href: '/user/violations/violation-form',
          description:
            "Fill out the Violation Form to formally report a violation to the Homeowners' Association."
        },
        {
          text: 'Submitted Violation Reports',
          href: '/user/violations/submitted-violations',
          description:
            "Monitor the progress of your submitted violation forms to the Homeowners' Association."
        },
        {
          text: 'Violation Letters and Notices',
          href: '/user/violations/letters-and-notices',
          description:
            "Access your received violation letters and notices from the Homeowners' Association."
        }
      ]
    }
  ]

  return (
    <>
      <Heading title={pageTitle} description={pageDescription} />

      <SimpleGrid spacing={6} columns={{ md: 1, lg: 3 }} w='max-content'>
        {/* Violation Management */}
        {violationManagementMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* Violation Knowledge Base */}
        {knowledgeBaseMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
        {/* Report Violations  */}
        {reportViolationsMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
      </SimpleGrid>
    </>
  )
}
