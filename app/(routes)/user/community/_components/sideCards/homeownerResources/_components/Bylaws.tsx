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
  Text,
  useToast
} from '@chakra-ui/react'
import { Hoa } from '@prisma/client'

import { useRouter } from 'next/navigation'

export default function Bylaws ({ hoa }: { hoa: Hoa }) {
  const title = "Homeowners' Association Bylaws"
  const description = "View the Homeowners' Association Bylaws."

  const toast = useToast()
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      <Button
        variant='link'
        fontFamily='font.body'
        fontWeight='light'
        onClick={() => {
          hoa.byLawsLink
            ? onOpen()
            : toast({
                title: `HOA Bylaws has not been uploaded yet`,
                description: `Kindly contact any of the HOA Officers`,
                status: 'info',
                position: 'bottom-right',
                isClosable: true
              })
        }}
        color='black'
        size='sm'
      >
        {title}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement='right' size='lg'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader mt='10px'>
            <Heading size='md' fontFamily='font.heading'>
              {title}
            </Heading>
            <Text fontSize='xs'>{description}</Text>
          </DrawerHeader>
          <DrawerBody>
            {hoa.byLawsLink ? (
              <iframe
                src={hoa.byLawsLink}
                title='HOA Bylaws'
                width='100%'
                height='900px'
              ></iframe>
            ) : (
              <Text>No bylaws available</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
