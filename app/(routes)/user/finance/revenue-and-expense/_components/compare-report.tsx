'use client'

import { HiDocumentReport } from 'react-icons/hi'
import CompareReportForm from './compare-report-form'
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react'

export default function CompareMonthlyReports () {
  // Form Title and instructions
  const formTitle = 'Generate Monthly Comparison Report'
  const formInstructions = `Fill out the following fields to generate a comparison report of the association's revenues and expenses between two specified periods.`

  // Modal functions
  const { isOpen, onClose, onOpen } = useDisclosure()

  const handleSuccess = () => {
    onClose() // This uses the onClose function from useDisclosure to close the modal
  }

  return (
    <>
      {/* Button */}
      <Button
        size='sm'
        colorScheme='yellow'
        variant='outline'
        leftIcon={<HiDocumentReport size='18px' />}
        onClick={() => onOpen()}
      >
        <Text fontSize={'md'} fontFamily={'font.body'}>
          {formTitle}
        </Text>
      </Button>

      {/* Modal when button is clicked */}
      <Modal isOpen={isOpen} onClose={onClose} motionPreset='scale'>
        <ModalOverlay />
        <ModalContent pt={'10px'} pb={'1.5rem'}>
          <ModalHeader>
            <ModalCloseButton />
            <Stack spacing={0.5}>
              <Heading size='md' fontFamily={'font.heading'}>
                {formTitle}
              </Heading>
              <Text
                fontSize='sm'
                fontFamily={'font.body'}
                textAlign='justify'
                fontWeight='normal'
                lineHeight={1.2}
              >
                {formInstructions}
              </Text>
            </Stack>
          </ModalHeader>
          <ModalBody>
            <CompareReportForm onSuccess={handleSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
