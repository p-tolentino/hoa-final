'use client'

import { Heading } from '@/components/ui/heading'
import { SimpleGrid } from '@chakra-ui/react'
import ModuleMenuCard from '@/components/system/ModuleMenuCard'

export default function FacilityMenu () {
  // Page Title and Description
  const pageTitle = 'Facility Reservation'
  const pageDescription = `Navigate the ${pageTitle} module.`

  const facilityManagementMenuCard = [
    {
      category: 'Facility Management',
      // category_users: 'Association Officers and Board of Directors',
      category_buttons: [
        {
          text: 'HOA Facility Reservation Record',
          href: '/user/facility/reservation-all',
          description:
            "Access the facility reservation record of the Homeowners' Association."
        }
      ],
      officerRequired: true
    }
  ]

  const facilityReservationMenuCard = [
    {
      category: 'Facility Reservation',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Reserve a Facility',
          href: '/user/facility/facility-list',
          description:
            "Reserve from the list of facilities available in the Homeowners' Association."
        },
        {
          text: 'Your Facility Reservation Record',
          href: '/user/facility/reservation-user',
          description:
            "Access your facility reservation record in the Homeowners' Association."
        }
      ]
    }
  ]

  return (
    <>
      <Heading title={pageTitle} description={pageDescription} />

      <SimpleGrid spacing={6} columns={{ md: 1, lg: 3 }} w='max-content'>
        {/* Facility Management */}
        {facilityManagementMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* Facility Reservation */}
        {facilityReservationMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
      </SimpleGrid>
    </>
  )
}
