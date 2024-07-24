'use client'
import { Box, Text, UnorderedList, ListItem } from '@chakra-ui/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Hoa } from '@prisma/client'
import StepCard from './step-card'

export default function ViolationEnforcement ({ hoa }: { hoa: Hoa }) {
  const processSteps = [
    {
      value: 'step1',
      title: ' Violation Form Submission',
      description:
        'Homeowners submit violation reports through the Violation Monitoring module in the MIS.',
      details: [
        'Homeowners provide details about the type of violation, date, and a detailed description of the violation.',
        'Supporting evidence such as photos or documents may be attached to the violation report.'
      ]
    },
    {
      value: 'step2',
      title: 'Review by Security Committee',
      description:
        'The Security Committee receives and reviews the violation report.',
      details: [
        'The Security Committee assesses the validity of the reported violation based on the community rules and regulations.',
        'The result of the assessment will provide the list of key activities to be followed by the officer assigned to oversee the violation case, including the expected accomplishment date of each activity.'
      ]
    },
    {
      value: 'step3',
      title: 'Assign Officer to Oversee Violation Case',
      description:
        'An officer is designated to oversee the enforcement of the violation case.',
      details: [
        'The designated officer of the violation case will be a member of the Security Committee.',
        'The officer reviews the timeline of the violation enforcement key activities provided by the committee and makes necessary preparations.'
      ]
    },
    {
      value: 'step4',
      title: 'Send out Violation Letters',
      description:
        'The violator(s) are informed of the violation through official violation letters.',
      details: [
        'The designated officer sends violation letters to the alleged violator(s) via the MIS.',
        'The violation letter outlines the nature of the violation, required corrective actions, and the corresponding penalty fee.',
        'The violator(s) are given a deadline before the penalty fee is applied on their statement of account.'
      ]
    },
    {
      value: 'step5',
      title: 'Negotiations to Appeal Violation Case',
      description:
        'The violator has the opportunity to negotiate or appeal the violation case before the specified deadline to pay the penalty fee.',
      details: [
        'The designated officer communicates with the alleged violator(s) to discuss the violation and potential resolutions.',
        'Negotiations may involve addressing misunderstandings, providing explanations, or reaching a settlement agreement.',
        'The designated officer submits progress reports outlining the activities performed until the violation case reaches its resolution and/or enforcement.'
      ]
    },
    {
      value: 'step6',
      title: 'Violation Enforcement with Penalty Fee',
      description:
        'The designated officer initiates enforcement measures according to HOA guidelines, such as issuing fines or penalties.',
      details: [
        'If the violation is not resolved or appealed successfully, enforcement actions are taken, potentially including penalty fees.',
        'The violator(s) are informed that the penalty fee is added to their statement of account, which can be accessed via the Finance Management module.'
      ]
    }
  ]

  return (
    <div>
      <Box mb='1.5rem'>
        {/* Section Title */}
        <Text fontSize='xl' fontFamily='font.heading' fontWeight='bold'>
          Violation Monitoring
        </Text>
        {/* Section Description */}
        <Text fontSize='sm' fontFamily='font.body' color='grey'>
          You may click any step from the tabs list to view its detailed
          description.
        </Text>
      </Box>

      <Tabs defaultValue='step1' className='w-full'>
        <>
          <TabsList key='violationStepTabs' className='grid w-full grid-cols-6'>
            {processSteps.map((step, index) => (
              <TabsTrigger key={step.value} value={step.value}>
                Step {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {processSteps.map((step, index) => (
            <TabsContent key={step.value} value={step.value}>
              <StepCard
                key={step.value}
                stepIndex={index}
                processSteps={processSteps}
                hoa={hoa}
              />
            </TabsContent>
          ))}
        </>
      </Tabs>

      <Box fontSize='sm' fontFamily='font.body' mt='1rem'>
        <Text>
          The HOA maintains a comprehensive record of violation reports, actions
          taken, and penalty fees imposed.
        </Text>
        <UnorderedList ml={7}>
          <ListItem>
            Comprehensive records of violation reports, actions taken, and
            penalty fees imposed are maintained.
          </ListItem>
          <ListItem>
            Each violation report is documented, including evidence, committee
            decisions, enforcement actions, and penalty fee details.
          </ListItem>
          <ListItem>
            Records are kept organized and easily accessible for future
            reference in the MIS.
          </ListItem>
        </UnorderedList>
      </Box>
    </div>
  )
}
