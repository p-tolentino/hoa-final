import { Heading } from '@/components/ui/heading'
import { SimpleGrid } from '@chakra-ui/react'
import ModuleMenuCard from '@/components/system/ModuleMenuCard'

import { getFacilities } from '@/server/data/facilities'
import { getAllRegularMaintainService } from '@/server/data/maintenance-sched'
import FacilityMaintenanceAnnouncements from './_components/FacilityMaintenanceAnnouncements'
import { db } from '@/lib/db'

export default async function MaintenanceMenu () {
  // Page Title and Description
  const pageTitle = 'Maintenance Handling'
  const pageDescription = `Navigate the ${pageTitle} module.`

  const maintenanceManagementMenuCard = [
    {
      category: 'Maintenance Management',
      category_users: 'Environment & Sanitation Committee',
      category_buttons: [
        {
          text: 'HOA Maintenance Record',
          href: '/user/maintenance/maintenance-record',
          description:
            "Manage and view the maintenance record in the Homeowners' Association."
        },
        {
          text: 'Regular Facility Maintenance',
          href: '/user/maintenance/regular-maintenance',
          description:
            "Manage the schedules for regular facility maintenance in the Homeowners' Association."
        }
      ],
      officerRequired: true
    }
  ]

  const maintenanceKnowledgeBaseMenuCard = [
    {
      category: 'Maintenance Knowledge Base',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Maintenance Handling Process Guide',
          href: '/user/maintenance/process-guide',
          description:
            "Read more about the maintenance handling process within the Homeowners'Association."
        },
        {
          text: 'List of Maintenance Services',
          href: '/user/maintenance/maintenance-list',
          description:
            'View the list of maintenance services that can be requested in the HOA. Additional fees may apply for outsourced maintenance.'
        },
        {
          text: 'List of External Maintainers Contact Details',
          href: '/user/maintenance/external-contacts',
          description:
            "View the contacts details of external maintainers of the Homeowners' Association."
        }
      ],
      officerRequired: false
    }
  ]

  const maintenanceReportingMenuCard = [
    {
      category: 'Request Maintenance',
      // category_users: 'ALL Homeowners',
      category_buttons: [
        {
          text: 'Maintenance Request Form',
          href: '/user/maintenance/maintenance-form',
          description:
            "Fill out the Maintenance Form to formally request a maintenance activity from the Homeowners' Association."
        },
        {
          text: 'Submitted Maintenance Requests',
          href: '/user/maintenance/submitted-maintenance',
          description:
            "View your submitted maintenance requests to the Homeowners' Association and monitor its progress."
        }
      ],
      officerRequired: false
    }
  ]

  const facilities = await getFacilities()
  const schedules = await getAllRegularMaintainService()
  const notices = await db.maintenanceNotice.findMany()
  const officers = await db.personalInfo.findMany({
    where: {
      committee: 'Environment & Sanitation Committee'
    }
  })

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <FacilityMaintenanceAnnouncements
            officers={officers}
            notices={notices.sort((a: any, b: any) => {
              // Combine startDate and startTime into a single Date object for comparison
              const startA = new Date(
                `${a.startDate.toISOString().split('T')[0]}T${
                  a.startTime
                }:00.000Z`
              )
              const startB = new Date(
                `${b.startDate.toISOString().split('T')[0]}T${
                  b.startTime
                }:00.000Z`
              )

              // Combine endDate and endTime into a single Date object for comparison
              const endA = new Date(
                `${a.endDate.toISOString().split('T')[0]}T${a.endTime}:00.000Z`
              )
              const endB = new Date(
                `${b.endDate.toISOString().split('T')[0]}T${b.endTime}:00.000Z`
              )

              // First, compare the combined start datetime
              if (startA < startB) return -1
              if (startA > startB) return 1

              // If start datetime is the same, compare the combined end datetime
              if (endA < endB) return -1
              if (endA > endB) return 1

              // If both are the same, return 0 (they are equal)
              return 0
            })}
            schedules={schedules}
            facilities={facilities}
          />
        }
      />

      <SimpleGrid spacing={6} columns={{ md: 1, lg: 3 }} w='max-content'>
        {/* Maintenance Management */}
        {maintenanceManagementMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* Maintenance Knowledge Base */}
        {maintenanceKnowledgeBaseMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}

        {/* Request Maintenance  */}
        {maintenanceReportingMenuCard.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
      </SimpleGrid>
    </>
  )
}
