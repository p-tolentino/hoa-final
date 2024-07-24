'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FaUser as User } from 'react-icons/fa'
import { getAddressById } from '@/server/actions/property'
import { getHouseMembers } from '@/server/actions/user-info'
import { HomeownerColumn } from './columns'
import { useEffect, useState } from 'react'
import { PersonalInfo, Status } from '@prisma/client'
import { FaHouseUser as HouseMember } from 'react-icons/fa6'
import {
  Heading,
  Box,
  Text,
  Stack,
  Avatar,
  HStack,
  Table,
  Tbody,
  Tr,
  Td,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Center
} from '@chakra-ui/react'

interface ViewInfoProps {
  data: HomeownerColumn
}

export const ViewInfo: React.FC<ViewInfoProps> = ({ data }) => {
  const DrawerTitle = 'Member Information'

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [property, setProperty] = useState('')
  const [houseMembers, setHouseMembers] = useState<PersonalInfo[] | undefined>()

  useEffect(() => {
    getAddressById(data.address).then(data => {
      if (data) {
        setProperty(data?.property?.address || '')
      }
    })

    getHouseMembers(data.address).then(data => {
      if (data) {
        setHouseMembers(data?.users)
      }
    })
  }, [])

  return (
    <>
      <Button
        fontFamily='font.body'
        onClick={() => onOpen()}
        key={`${DrawerTitle} of ${data.name}`}
        colorScheme='green'
        variant='ghost'
        size='sm'
      >
        {DrawerTitle}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement='right' size='lg'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader mt='10px'>
            <Heading size='md' fontFamily='font.heading'>
              {DrawerTitle}
            </Heading>
          </DrawerHeader>
          <DrawerBody pb={5}>
            <Stack spacing={8} pb='2rem'>
              <Box w='100%' h='100%' p={3}>
                <HStack>
                  {/* Member's Avatar */}
                  <Avatar
                    size='2xl'
                    src={data.image || ''}
                    bg='yellow.500'
                    icon={<User />}
                  />
                  {/* Member's Name */}
                  <Box ml='10px'>
                    <Heading
                      size='lg'
                      fontFamily='font.heading'
                      className='capitalize'
                    >
                      {data.name}
                    </Heading>
                    <Box fontFamily='font.body'>
                      {/* Member's Position */}
                      <Text fontSize='lg'>
                        {data.position}
                        {data.committee && ` | ${data.committee}`}
                      </Text>
                      {/* Member's Status */}
                      <Text fontSize='sm' lineHeight='0.5' mt='1rem'>
                        Status:
                      </Text>
                      <Badge
                        className={cn(
                          'mt-2 text-md',
                          data.status === Status.ACTIVE
                            ? 'bg-green-700'
                            : data.status === Status.INACTIVE ||
                              Status.DELINQUENT
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

              <Accordion defaultIndex={[1]} allowMultiple px='10px'>
                {/* Member's Biography */}
                <AccordionItem p={1}>
                  <AccordionButton>
                    <Box
                      as='span'
                      flex='1'
                      textAlign='left'
                      fontWeight='semibold'
                      fontFamily='font.heading'
                    >
                      Biography
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    py={2}
                    fontFamily='font.body'
                    textAlign='justify'
                    color={data.bio ? 'initial' : 'gray'}
                  >
                    {data.bio || 'This user has not set up their bio yet.'}
                  </AccordionPanel>
                </AccordionItem>

                {/* Personal Information */}
                <AccordionItem p={1}>
                  <AccordionButton>
                    <Box
                      as='span'
                      flex='1'
                      textAlign='left'
                      fontWeight='semibold'
                      fontFamily='font.heading'
                    >
                      Personal Information
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    pb={4}
                    fontFamily='font.body'
                    textAlign='justify'
                  >
                    <Table>
                      <Tbody>
                        <Tr fontFamily='font.body'>
                          <Td
                            px={3}
                            py={1}
                            fontFamily='font.body'
                            fontWeight='semibold'
                          >
                            House No. & Street:
                          </Td>
                          <Td px={0} py={1} fontFamily='font.body'>
                            {property}
                            {/* Need to wait */}
                          </Td>
                        </Tr>
                        <Tr fontFamily='font.body'>
                          <Td
                            px={3}
                            py={1}
                            fontFamily='font.body'
                            fontWeight='semibold'
                          >
                            Contact Number:
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
                            fontWeight='semibold'
                          >
                            Email Address:
                          </Td>
                          <Td px={0} py={1} fontFamily='font.body'>
                            <a href={`mailto:${data.email}`} target='_blank'>
                              {data.email}
                            </a>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              {/* Other Household Members */}
              <Box px={5}>
                <Text fontWeight='semibold' fontFamily={'font.heading'}>
                  Other Household Members
                </Text>
                <Box
                  h={40}
                  border='1px solid lightgrey'
                  borderRadius={5}
                  p={3}
                  fontFamily='font.body'
                  overflowY='auto'
                >
                  {houseMembers?.length ? (
                    houseMembers?.map(
                      member =>
                        member.userId !== data.id && (
                          <div key={member.id}>
                            <div className='flex justify-between'>
                              <div key={member.id} className='flex'>
                                <HouseMember className='mt-2 mr-2' />{' '}
                                {`${member?.firstName} ${member?.lastName}`}
                              </div>
                              <div className='capitalize'>
                                {`${member?.relation?.toLowerCase()}`} (
                                {`${member?.type}`})
                              </div>
                            </div>
                            <Separator className='my-2' />
                          </div>
                        )
                    )
                  ) : (
                    <span className='text-gray-400'>
                      No household members found.
                    </span>
                  )}
                </Box>
              </Box>
              {/* Vehicles Owned */}
              {/* <Box px={5}>
                <Text fontWeight='semibold' fontFamily={'font.heading'} mt={3}>
                  Vehicles Owned
                </Text>
                <Box
                  h={40}
                  border='1px solid lightgrey'
                  borderRadius={5}
                  p={3}
                  fontFamily='font.body'
                  overflowY='auto'
                >
                  {vehicles.length ? (
                    vehicles.map(vehicle => (
                      <>
                        <div key={vehicle.id} className='flex'>
                          <Car className='w-5 h-5 pt-1 mr-2' />
                          {vehicle.plateNum}
                        </div>
                        <Separator className='my-2' />
                      </>
                    ))
                  ) : (
                    <span className='text-gray-400'>No vehicles recorded.</span>
                  )}
                </Box>
              </Box> */}

              {/* Government-Issued ID */}
              <Box px={5}>
                <Text fontWeight='semibold' fontFamily={'font.heading'}>
                  Government-Issued ID
                </Text>
                <Center
                  h={data.govtId ? 'max-content' : 40}
                  border='1px solid lightgrey'
                  borderRadius={5}
                  fontFamily='font.body'
                  overflowY='auto'
                  p={3}
                >
                  {data.govtId.length ? (
                    <Image
                      objectFit='contain'
                      src={data.govtId}
                      alt={`Government ID of ${data.name}`}
                    />
                  ) : (
                    <span className='text-gray-400'>
                      No government ID uploaded yet.
                    </span>
                  )}
                </Center>
              </Box>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
export default ViewInfo
