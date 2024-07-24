'use client'

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Heading,
  Box,
  Text,
  Stack,
  Avatar,
  HStack,
  Table,
  Tbody,
  Tr,
  Td
} from '@chakra-ui/react'
import { AdminColumn } from './columns'
import { Status } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { FaUser as User } from 'react-icons/fa'

interface ViewInfoProps {
  data: AdminColumn
}

export const ViewInfo: React.FC<ViewInfoProps> = ({ data }) => {
  const action = 'Member Information'
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        fontFamily='font.body'
        onClick={() => onOpen()}
        key={action}
        colorScheme='green'
        variant='ghost'
        size='sm'
      >
        {action}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement='right' size='lg'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader mt='10px'>
            <Heading size='md' fontFamily='font.heading'>
              Member Information
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={5} paddingRight='20px' pb='2rem'>
              <Box w='100%' h='100%' p='20px'>
                <HStack>
                  <Avatar
                    size='2xl'
                    src={data.image || ''}
                    bg='yellow.500'
                    icon={<User />}
                  />
                  <Box ml='10px'>
                    <Heading
                      size='lg'
                      fontFamily='font.heading'
                      className='capitalize'
                    >
                      {data.name}
                    </Heading>
                    <Box fontFamily='font.body'>
                      <Text fontSize='24px'>
                        {data.role} | {data.position}
                      </Text>
                      <Text fontSize='sm' lineHeight='0.5' mt='1rem'>
                        Status:
                      </Text>
                      <Badge
                        className={cn(
                          'mt-2 text-xl',
                          data.status === Status.ACTIVE
                            ? 'bg-green-700'
                            : data.status === Status.INACTIVE
                            ? 'bg-red-700'
                            : data.status === Status.PENDING
                            ? 'bg-yellow-600'
                            : 'display-none'
                        )}
                      >
                        {data.status}
                      </Badge>
                    </Box>
                  </Box>
                </HStack>
              </Box>

              <Box w='100%' h='100%' px='10px'>
                <Box w='100%' h='100%' p='5'>
                  <Heading size='md' fontFamily={'font.heading'} mb={'1rem'}>
                    Biography
                  </Heading>
                  <Text fontFamily='font.body' textAlign='justify'>
                    {data.bio || '-'}
                  </Text>
                </Box>

                <Box w='100%' h='100%' p='5'>
                  <Heading size='md' fontFamily={'font.heading'} mb={'1rem'}>
                    Personal Information
                  </Heading>
                  <Text>
                    <Table>
                      <Tbody>
                        <Tr fontFamily='font.body'>
                          <Td
                            px={3}
                            py={1}
                            fontFamily='font.body'
                            style={{ fontWeight: 'bold' }}
                          >
                            House No. & Street:
                          </Td>
                          <Td px={0} py={1} fontFamily='font.body'>
                            {data.address}
                          </Td>
                        </Tr>
                        <Tr fontFamily='font.body'>
                          <Td
                            px={3}
                            py={1}
                            fontFamily='font.body'
                            style={{ fontWeight: 'bold' }}
                          >
                            Contact Number
                          </Td>
                          <Td px={0} py={1} fontFamily='font.body'>
                            {data.phoneNumber}
                          </Td>
                        </Tr>
                        <Tr fontFamily='font.body'>
                          <Td
                            px={3}
                            py={1}
                            fontFamily='font.body'
                            style={{ fontWeight: 'bold' }}
                          >
                            Email Address
                          </Td>
                          <Td px={0} py={1} fontFamily='font.body'>
                            <a href={`mailto:${data.email}`} target='_blank'>
                              {data.email}
                            </a>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Text>
                </Box>
              </Box>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default ViewInfo
