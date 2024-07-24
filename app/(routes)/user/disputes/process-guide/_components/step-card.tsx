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
              *A unique identifier or tracking number is assigned to the dispute
              report for future reference. <br />
              *Homeowners can view their dispute report submission in the{' '}
              <Link
                href='/user/disputes/submitted-disputes'
                color='blue.600'
                textDecor='underline'
              >
                Submitted Dispute Forms
              </Link>{' '}
              in the Dispute Resolution module.
              <br />
              *The upcoming review process and potential follow-up actions can
              also be accessed by clicking on the Resolution Progress link in
              the submitted dispute report row.
            </Text>
          )}
          {stepIndex === 3 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *The estimated deadline before the penalty fee is imposed is{' '}
              <b>two (2) weeks</b> to provide the complainee(s) with an
              opportunity to address the dispute.
              <br />
              *A notice is issued to the complainee(s) <b>one (1) day</b> prior
              to meeting schedule.
            </Text>
          )}
          {stepIndex === 4 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *The complainee(s) can access all key activities performed,
              including detailed progress reports of their case in the{' '}
              <Link
                href='/user/disputes/submitted-disputes'
                color='blue.600'
                textDecor='underline'
              >
                Submitted Dispute Forms
              </Link>{' '}
              in the Dispute Resolution module.
            </Text>
          )}
        </Box>
      </CardBody>
    </Card>
  )
}
