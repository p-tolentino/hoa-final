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
  Text
} from '@chakra-ui/react'

export default function Bylaws () {
  const title = 'Disaster Preparedness Guidelines'
  const description = 'View the Disaster Preparedness & First Aid Handbook.'
  const fileSource =
    'https://climate.gov.ph/files/Disaster_Preparedness_First_Aid_Handbook.pdf'

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      <Button
        variant='link'
        fontFamily='font.body'
        fontWeight='light'
        onClick={() => onOpen()}
        key='DisasterPreparedness'
        color='black'
        size='sm'
      >
        {title}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement='right' size='full'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader mt='10px'>
            <Heading size='md' fontFamily='font.heading'>
              {title}
            </Heading>
            <Text fontSize='xs'>{description}</Text>
            <Text fontSize='xs' color='grey' mt='1rem'>
              Source: {fileSource}
            </Text>
          </DrawerHeader>
          <DrawerBody>
            <object
              data='/documents/Disaster-Preparedness-Handbook.pdf'
              type='application/pdf'
              width='100%'
              height='900px'
            ></object>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
