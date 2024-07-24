import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Box,
  UnorderedList,
  ListItem,
  Link,
  Divider
} from '@chakra-ui/react'
import { Hoa } from '@prisma/client'

interface ProcessStep {
  value: string
  title: string
  description: string
  details: string[]
}

interface StepCardProps {
  stepIndex: number
  processSteps: ProcessStep[]
  hoa: Hoa
}

export default function StepCard ({
  stepIndex,
  processSteps,
  hoa
}: StepCardProps) {
  return (
    <Card
      shadow='lg'
      my='1.5rem'
      h='48vh'
      p='10px 10px 20px 10px'
      overflowY='auto'
    >
      <CardHeader pb={0}>
        <Text
          fontSize='sm'
          fontFamily='font.body'
          color='brand.500'
          fontWeight='bold'
        >
          Step {stepIndex + 1}
        </Text>
        <Text fontSize='lg' fontFamily='font.heading' fontWeight='bold'>
          {/* Step Title */}
          {processSteps[stepIndex].title}
        </Text>
        <Text fontFamily='font.body' textAlign='justify'>
          {/* Step Description */}
          {processSteps[stepIndex].description}
        </Text>
        <Divider mt='0.5rem' />
      </CardHeader>
      <CardBody pt={2}>
        <Box fontFamily='font.body' fontSize='sm' textAlign='justify'>
          <Text>Details:</Text>
          <UnorderedList mb='1rem' ml={7}>
            {processSteps[stepIndex].details.map((detail, index) => (
              <ListItem key={index}>{detail}</ListItem>
            ))}
          </UnorderedList>

          {/* More Information */}
          {stepIndex === 0 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *A unique identifier or tracking number is assigned to the
              maintenance report for future reference. <br />
              *Homeowners can view their maintenance report submission in the{' '}
              <Link
                href='/user/maintenance/submitted-maintenance'
                color='blue.500'
                textDecor='underline'
              >
                Submitted Maintenance Reports
              </Link>{' '}
              in the Maintenance Handling module.
              <br />
              *The upcoming review process and potential follow-up actions can
              also be accessed by clicking on the View Progress link in the
              submitted maintenance report row.
            </Text>
          )}
          {stepIndex === 1 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *The Environment & Sanitation Committee validates the maintenance
              report by ensuring it contains sufficient information and
              evidence. <br />
              *The maintenance report is reviewed to determine its validity, and
              thus, requires immediate maintenance actions.
            </Text>
          )}
          {stepIndex === 3 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *A maintenance notice is issued to all homeowners via the MIS once
              the Environment & Sanitation committee has decided on the list of
              required maintenance activities. This is to ensure all homoeowners
              are well-informed of new maintenance schedules.
            </Text>
          )}
          {stepIndex === 4 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *The homeowner who submitted the maintenance request can access
              all key activities performed, including detailed progress reports
              of their request in the{' '}
              <Link
                href='/user/maintenance/submitted-maintenance'
                color='blue.500'
                textDecor='underline'
              >
                Submitted Maintenance Reports
              </Link>{' '}
              in the Maintenance Handling module.
              <br />
            </Text>
          )}
          {stepIndex === 5 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *An external maintenance fee may be added to the association's
              expense record if applicable.
              <br />
            </Text>
          )}
        </Box>
      </CardBody>
    </Card>
  )
}
