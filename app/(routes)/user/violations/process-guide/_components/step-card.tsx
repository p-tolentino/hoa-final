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
import ViolationBylaws from './ViolationBylaws'

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
              violation report for future reference. <br />
              *Homeowners can view their violation report submission in the{' '}
              <Link
                href='/user/violations/submitted-violations'
                color='blue.600'
                textDecor='underline'
              >
                Submitted Violation Forms
              </Link>{' '}
              in the Violation Monitoring module.
              <br />
              *The upcoming review process and potential follow-up actions can
              also be accessed by clicking on the Enforcement Progress link in
              the submitted violation report row.
            </Text>
          )}
          {stepIndex === 1 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *The Security Committee validates the violation report by ensuring
              it contains sufficient information and evidence. <br />
              *The violation report is reviewed to determine whether or not it
              falls within the jurisdiction of the HOA's rules and regulations
              indicated in the <ViolationBylaws hoa={hoa} />.
            </Text>
          )}
          {stepIndex === 3 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *The estimated deadline before the penalty fee is imposed is{' '}
              <b>two (2) weeks</b> to provide the violator with an opportunity
              to address the violation.
              <br />
              *A notice is issued to the violator(s) <b>one (1) day</b> prior to
              the designated deadline to ensure they are adequately apprised of
              their decision.
            </Text>
          )}
          {stepIndex === 4 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *The violator(s) can access all key activities performed,
              including detailed progress reports of their case in the{' '}
              <Link
                href='/user/violations/submitted-violations'
                color='blue.600'
                textDecor='underline'
              >
                Submitted Violation Forms
              </Link>{' '}
              in the Violation Monitoring module.
              <br />
              *The procedure on how to{' '}
              <Link
                href='#appealViolations'
                color='blue.600'
                textDecor='underline'
              >
                appeal to the violation
              </Link>{' '}
              can be found in the Violation Process Guide in the Violation
              Monitoring module.
            </Text>
          )}
          {stepIndex === 5 && (
            <Text fontSize='xs' fontStyle='italic' color='grey'>
              *The penalty fee is added to the violator's statement of account
              and they are duly notified.
              <br />
              *The procedure on how to{' '}
              <Link
                href='#payPenaltyFee'
                color='blue.600'
                textDecor='underline'
              >
                pay the penalty fee
              </Link>{' '}
              can be accessed via the Violation Monitoring Process Guide in the
              Violation Monitoring module.
            </Text>
          )}
        </Box>
      </CardBody>
    </Card>
  )
}
