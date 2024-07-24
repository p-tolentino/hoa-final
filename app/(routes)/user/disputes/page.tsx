'use client'

import { Heading } from '@/components/ui/heading'
import { EditIcon } from '@chakra-ui/icons'
import { SimpleGrid, Link, Divider } from '@chakra-ui/react'
import ModuleMenuCard from '@/components/system/ModuleMenuCard'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function DisputeMenu () {
  // Page Title and Description
  const pageTitle = 'Dispute Resolution'
  const pageDescription = `Navigate the ${pageTitle} module.`

  const user = useCurrentUser()

  const disputeManagementMenuCard = [
    {
      category: 'Dispute Management',
      category_users: 'Grievance & Adjudication Committee',
      category_buttons: [
        {
          text: 'HOA Dispute Record',
          href: '/user/disputes/dispute-record',
          description:
            "Manage the dispute record in the Homeowners' Association."
        }
      ],
      officerRequired: true
    }
  ]

  const disputeKnowledgeBaseMenuCard = [
    {
      category: 'Dispute Knowledge Base',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Dispute Resolution Process Guide',
          href: '/user/disputes/process-guide',
          description:
            "Read more about the dispute resolution process in the Homeowners' Association."
        },
        {
          text: 'List of Disputes',
          href: '/user/disputes/dispute-list',
          description:
            "Access the consolidated list of disputes that can be reported to the Homeowners' Association."
        }
      ]
    }
  ]

  const fileDisputesMenuCard = [
    {
      category: 'File Disputes',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Dispute Form',
          href: '/user/disputes/dispute-form',
          description:
            "Fill out the Violation Form to formally request a violation review from the Homeowners' Association."
        },
        {
          text: 'Submitted Dispute Reports',
          href: '/user/disputes/submitted-disputes',
          description:
            "Monitor the progress of your submitted dispute forms to the Homeowners' Association."
        },
        {
          text: 'Dispute Letters and Notices',
          href: '/user/disputes/letters-and-notices',
          description:
            "Access your received dispute letters and notices from the Homeowners' Association."
        }
      ]
    }
  ]

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          // Barangay Police Contact Details & PNP Directory
          <div className='lg:text-right'>
            <div className='text-sm font-semibold'>
              In case of emergencies, please contact the authorities using the
              resources below: <br />
              <Link
                href='https://www.dilg.gov.ph/barangay-officials-directory'
                isExternal
                color='blue.600'
                fontWeight='semibold'
              >
                Barangay Officials Directory
              </Link>
              <Divider orientation='vertical' />
              <Link
                href='https://pnp.gov.ph/wp-content/uploads/2021/12/PNP-TELEPHONE-DIRECTORY-2021-AS-OF-NOVEMBER-2021-CORRECTED-COPY.pdf'
                isExternal
                color='blue.600'
                fontWeight='semibold'
              >
                Philippine National Police (PNP) Directory
              </Link>
            </div>
          </div>
        }
      />

      <SimpleGrid spacing={6} columns={{ md: 1, lg: 3 }} w='max-content'>
        {/* Dispute Management */}
        {disputeManagementMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* Dispute Knowledge Base  */}
        {disputeKnowledgeBaseMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* File Disputes  */}
        {fileDisputesMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
      </SimpleGrid>
    </>
  )
}
