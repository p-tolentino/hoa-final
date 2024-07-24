'use client'

import { Heading } from '@/components/ui/heading'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCurrentUser } from '@/hooks/use-current-user'
import { MaintenanceType } from '@prisma/client'
import BackButton from '@/components/system/BackButton'
import AddMaintenanceButton from './AddMaintenanceButton'
import EditMaintenanceButton from './EditMaintenanceButton'
import DeleteMaintenanceButton from './DeleteMaintenanceButton'
import {
  Stack,
  Text,
  SimpleGrid,
  Flex,
  HStack,
  Card,
  CardHeader,
  CardBody,
  ButtonGroup
} from '@chakra-ui/react'

interface MaintenanceListProps {
  maintenanceServices: MaintenanceType[]
}

export const MaintenanceList: React.FC<MaintenanceListProps> = ({
  maintenanceServices
}) => {
  // Page Title and Description
  const pageTitle = 'List of Maintenance Services'
  const pageDescription =
    'View the list of maintenance services that can be requested in the HOA. Additional fees may apply for outsourced maintenance.'

  const user = useCurrentUser()
  const router = useRouter()

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            {(user?.info.committee === 'Environment & Sanitation Committee' ||
              user?.role === 'SUPERUSER') && <AddMaintenanceButton />}
            <BackButton />
          </ButtonGroup>
        }
      />

      <Flex flexGrow={3}>
        <ScrollArea className='h-[75vh] pr-5'>
          <SimpleGrid columns={{ md: 1, lg: 3 }} spacing={5} px={2}>
            {maintenanceServices
              .sort((a, b) => a.title.localeCompare(b.title))
              .map(maintenance => (
                <Card
                  key={maintenance.id}
                  pb={3}
                  display={maintenance.title === 'Other' ? 'none' : 'block'}
                >
                  <Stack>
                    <CardHeader pb='0'>
                      <HStack justifyContent='space-between' align='baseline'>
                        {/* Maintenance Title */}
                        <Text
                          size='md'
                          fontWeight='bold'
                          fontFamily='font.heading'
                        >
                          {maintenance.title}
                        </Text>
                        {(user?.info.committee ===
                          'Environment & Sanitation Committee' ||
                          user?.role === 'SUPERUSER') && (
                          <ButtonGroup>
                            {/* Edit Maintenance Button */}
                            <EditMaintenanceButton maintenance={maintenance} />
                            {/* Delete Maintenance Button */}
                            <DeleteMaintenanceButton
                              maintenance={maintenance}
                              continueDeletion={confirmed => {
                                if (confirmed) {
                                  router.refresh()
                                }
                              }}
                            />
                          </ButtonGroup>
                        )}
                      </HStack>
                    </CardHeader>
                    <CardBody pt={3} minH='100px'>
                      {/* Maintenance Description */}
                      <Text
                        fontSize='sm'
                        fontFamily='font.body'
                        textAlign='justify'
                      >
                        {maintenance.description}
                      </Text>
                    </CardBody>
                  </Stack>
                </Card>
              ))}
          </SimpleGrid>
        </ScrollArea>
      </Flex>
    </>
  )
}

export default MaintenanceList
