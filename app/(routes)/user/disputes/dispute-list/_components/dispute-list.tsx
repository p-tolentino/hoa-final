'use client'

import { Heading } from '@/components/ui/heading'
import { useRouter } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DisputeType } from '@prisma/client'
import { useCurrentUser } from '@/hooks/use-current-user'
import AddDisputeButton from './AddDisputeButton'
import EditDisputeButton from './EditDisputeButton'
import DeleteDisputeButton from './DeleteDisputeButton'
import BackButton from '@/components/system/BackButton'
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

interface DisputeListProps {
  disputes: DisputeType[]
}

export const DisputeList: React.FC<DisputeListProps> = ({ disputes }) => {
  // Page Title and Description
  const pageTitle = `List of Disputes`
  const pageDescription = `Access the consolidated list of disputes that can be reported to the Homeowners' Association.`

  const user = useCurrentUser()
  const router = useRouter()

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            {(user?.info.committee === 'Grievance & Adjudication Committee' ||
              user?.role === 'SUPERUSER') && <AddDisputeButton />}
            <BackButton />
          </ButtonGroup>
        }
      />

      <Flex flexGrow={3}>
        <ScrollArea className='h-[75vh] pr-5'>
          <SimpleGrid columns={{ md: 1, lg: 3 }} spacing={5} px={2}>
            {disputes
              .slice()
              .sort((a, b) =>
                a.title.includes('Emergencies') &&
                !b.title.includes('Emergencies')
                  ? -1
                  : !a.title.includes('Emergencies') &&
                    b.title.includes('Emergencies')
                  ? 1
                  : a.title.localeCompare(b.title)
              )
              .map(dispute => (
                <Card
                  key={dispute.id}
                  pb={3}
                  display={dispute.title === 'Other' ? 'none' : 'block'}
                  border={
                    dispute.title.includes('Emergencies')
                      ? '1px solid orange'
                      : 'none'
                  }
                >
                  <Stack>
                    <CardHeader pb='0'>
                      <HStack justifyContent='space-between' align='baseline'>
                        {/* Dispute Title */}
                        <Text
                          size='md'
                          fontWeight='bold'
                          fontFamily='font.heading'
                          color={
                            dispute.title.includes('Emergencies')
                              ? 'orange.800'
                              : 'inherit'
                          }
                        >
                          {dispute.title}
                        </Text>
                        {(user?.info.committee ===
                          'Grievance & Adjudication Committee' ||
                          user?.role === 'SUPERUSER') && (
                          <ButtonGroup ml={2}>
                            {/* Edit Dispute Button */}
                            <EditDisputeButton dispute={dispute} />

                            {/* Delete Dispute Button */}

                            {!dispute.title.includes('Emergencies') && (
                              <DeleteDisputeButton
                                dispute={dispute}
                                continueDeletion={confirmed => {
                                  if (confirmed) {
                                    router.refresh()
                                  }
                                }}
                              />
                            )}
                          </ButtonGroup>
                        )}
                      </HStack>
                    </CardHeader>
                    <CardBody pt={3} minH='100px'>
                      {/* Dispute Description */}
                      <Text
                        fontSize='sm'
                        fontFamily='font.body'
                        textAlign='justify'
                      >
                        {dispute.description}
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

export default DisputeList
