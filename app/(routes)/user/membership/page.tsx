import { Heading } from '@/components/ui/heading'
import { SimpleGrid } from '@chakra-ui/react'
import ModuleMenuCard from '@/components/system/ModuleMenuCard'

const Membership = async () => {
  // Page Title and Description
  const pageTitle = 'Membership'
  const pageDescription = `Navigate the ${pageTitle} module.`

  const userManagement = [
    {
      category: 'User Management',
      // category_users: 'Admins, Officers, and Board of Directors',
      category_buttons: [
        {
          text: 'Homeowners Directory',
          href: `/user/membership/homeowner-directory`,
          description: `Manage all registered system users in the Homeowners’ Association.`,
          officerRequired: true
        },
        {
          text: 'Admin & Board of Directors Directory',
          href: `/user/membership/admin-directory`,
          description: `Access the consolidated list of system admins and board of directors, along with their respective information.`
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
          href: `/user/membership/properties/map`,
          description:
            "Browse properties owned by the Homeowners' Association and access their information."
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
