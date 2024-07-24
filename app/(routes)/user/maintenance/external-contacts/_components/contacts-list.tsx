'use client'

import {
  Card,
  CardBody,
  Divider,
  Text,
  Stack,
  Grid,
  GridItem,
  Flex,
  Box,
  CardFooter,
  ButtonGroup,
  UnorderedList,
  ListItem
} from '@chakra-ui/react'
import EditContactButton from './EditContactButton'
import DeleteContactButton from './DeleteContactButton'
import { useRouter } from 'next/navigation'
import { ExternalMaintainers } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'
import { format } from 'date-fns'

const ContactsList = ({
  contacts
}: {
  contacts: ExternalMaintainers[] | null | undefined
}) => {
  const router = useRouter()
  return (
    <Grid templateColumns='repeat(2, 1fr)' gap={6}>
      {contacts
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .map(contact => (
          <GridItem colSpan={1} key={contact.id}>
            <Card h='100%'>
              <CardBody>
                <Flex justifyContent='space-between'>
                  <Flex gap={5}>
                    <Box boxSize='100px' bg='' borderRadius='full'>
                      {contact.logoImg && (
                        <Avatar className='size-24'>
                          <AvatarImage src={contact.logoImg || ''} />
                          <AvatarFallback className='text-white bg-yellow-600'>
                            <User className='w-10 h-10' />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </Box>
                    <Stack spacing={3}>
                      <Text
                        size='md'
                        fontWeight='bold'
                        fontFamily='font.heading'
                      >
                        {contact.name}
                      </Text>
                      <Box>
                        <UnorderedList ml={5}>
                          {contact.contactNumbers.map((contactNum, index) => (
                            <ListItem
                              key={index}
                              fontSize='sm'
                              fontFamily='font.body'
                              textAlign='justify'
                            >
                              <u>Contact {index + 1}</u>: {contactNum}
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </Box>
                    </Stack>
                  </Flex>
                  <ButtonGroup spacing={0.5}>
                    <EditContactButton contact={contact} />
                    <DeleteContactButton
                      contact={contact}
                      continueDeletion={confirmed => {
                        if (confirmed) {
                          router.refresh()
                        }
                      }}
                    />
                  </ButtonGroup>
                </Flex>
                <Divider my={5} />
                <Text
                  fontSize='md'
                  fontFamily='font.body'
                  fontWeight='semibold'
                  textAlign='justify'
                >
                  {contact.service}
                </Text>
              </CardBody>
              <CardFooter pt={0}>
                <Text fontFamily='font.body' fontSize='sm' color='grey'>
                  Last updated:{' '}
                  {format(
                    new Date(contact.updatedAt).toLocaleString(),
                    'dd MMM yyyy, hh:mm aa'
                  )}
                </Text>
              </CardFooter>
            </Card>
          </GridItem>
        ))}
    </Grid>
  )
}

export default ContactsList
