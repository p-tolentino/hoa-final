import { SimpleGrid } from '@chakra-ui/react'
import ModuleMenuCard from '@/components/system/ModuleMenuCard'
import { currentUser } from '@/lib/auth'
import { Heading } from '@/components/ui/heading'

const Membership = async () => {
  const user = await currentUser()

  // Page Title and Description
  const pageTitle = 'Membership'
  const pageDescription = `Navigate the ${pageTitle} module.`

  const userManagement = [
    {
      category: 'User Management',
      // category_users: "Admins, Officers, and Board of Directors",
      category_buttons: [
        {
          text: 'Homeowners Directory',
          href: `/admin/membership/homeowner-directory`,
          description:
            'Manage all registered system users in the Homeowners’ Association.',
          officerRequired: true
        },
        {
          text: 'Admin & Board of Directors Directory',
          href: `/admin/membership/admin-directory`,
          description:
            'Access the consolidated list of system admins and officers, along with their respective information.',
          officerRequired: false
        }
      ]
    }
  ]

  const propertyManagement = [
    {
      category: 'Property Management',
      // category_users: 'Admins, Officers, and Board of Directors',
      category_buttons: [
        {
          text: 'HOA Properties',
          href: `/admin/membership/properties/map`,
          description:
            "Browse properties owned by the Homeowners' Association and access their information.",
          officerRequired: false
        }
      ]
    }
  ]

  return (
    <>
      <Heading title={pageTitle} description={pageDescription} />

      <SimpleGrid spacing={6} columns={{ md: 1, lg: 3 }} w='max-content'>
        {/* User Management */}
        {userManagement.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
        {/* Property Management */}
        {propertyManagement.map(categoryData => (
          <ModuleMenuCard
            key={categoryData.category}
            data={categoryData}
          ></ModuleMenuCard>
        ))}
      </SimpleGrid>
    </>
  )
}

export default Membership
