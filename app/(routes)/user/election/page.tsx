'use client'

import { Heading } from '@/components/ui/heading'
import { SimpleGrid } from '@chakra-ui/react'
import ModuleMenuCard from '@/components/system/ModuleMenuCard'

export default function ElectionMenu () {
  // Page Title and Description
  const pageTitle = 'Election Management'
  const pageDescription = `Navigate the ${pageTitle} module.`

  const electionManagementMenuCard = [
    {
      category: 'Election Management',
      category_users: 'Election Committee',
      category_buttons: [
        {
          text: 'HOA Election Record',
          href: '/user/election/election-record',
          description:
            "Manage and view the election record in the Homeowners' Association."
        },
        {
          text: 'Election Candidate Applications',
          href: '/user/election/applications',
          description:
            "Manage election candidate applications for elections in the Homeowners' Association."
        },
        {
          text: 'Election Setup',
          href: '/user/election/election-settings',
          description:
            "Create and setup elections in the Homeowners' Association."
        }
      ],
      officerRequired: true
    }
  ]

  const electionKnowledgeBaseMenuCard = [
    {
      category: 'Election Knowledge Base',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Guidelines for HOA Elections',
          href: '/user/election/guidelines',
          description: 'Read more about the guidelines for HOA Elections.'
        },
        {
          text: 'Election Committee Contact Details',
          href: '/user/election/election-contacts',
          description:
            "Access the contacts details of the election committee in the Homeowners' Association."
        }
      ]
    }
  ]

  const electionFormsAndReportssMenuCard = [
    {
      category: 'Election Forms & Reports',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Application for Candidacy',
          href: '/user/election/application-form',
          description:
            "Fill out the Application Form to formally apply for candidacy in the Homeowners' Association."
        },
        {
          text: 'Election Voting Form',
          href: '/user/election/election-voting',
          description:
            'Formally register your vote for the ongoing HOA elections.'
        },
        {
          text: 'HOA Election Record',
          href: '/user/election/election-record',
          description:
            "Access the election record of the Homeowners' Association."
        }
      ]
    }
  ]

  return (
    <>
      <Heading title={pageTitle} description={pageDescription} />

      <SimpleGrid spacing={6} columns={{ md: 1, lg: 3 }} w='max-content'>
        {/* Election Management */}
        {electionManagementMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* Election Knowledge Base */}
        {electionKnowledgeBaseMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* HOA Election Forms and Reports  */}
        {electionFormsAndReportssMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
      </SimpleGrid>
    </>
  )
}
