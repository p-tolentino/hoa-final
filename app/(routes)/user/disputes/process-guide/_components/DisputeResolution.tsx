'use client'
import { Box, Text, UnorderedList, ListItem } from '@chakra-ui/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Hoa } from '@prisma/client'
import StepCard from './step-card'

export default function DisputeResolution ({ hoa }: { hoa: Hoa }) {
  const processSteps = [
    {
      value: 'step1',
      title: ' Dispute Form Submission',
      description:
        'Homeowners submit dispute reports through the Dispute Resolution module in the MIS.',
      details: [
        'Homeowners provide details about the type of dispute, date, and a detailed description of the dispute.',
        'Supporting evidence such as photos or documents may be attached to the dispute report.'
      ]
    },
    {
      value: 'step2',
      title: 'Review by Grievance and Adjudication Committee',
      description:
        'The Grievance and Adjudication Committee receives and reviews the dispute report.',
      details: [
        'The Grievance and Adjudication Committee assesses the report and conducts an assessment to determine corrective actions.',
        'The result of the assessment will provide the list of key activities to be followed by the officer assigned to oversee the dispute case, including the expected accomplishment date of each activity.'
      ]
    },
    {
      value: 'step3',
      title: 'Assign Officer to Oversee Dispute Case',
      description:
        'An officer is designated to oversee the resolution of the dispute case.',
      details: [
        'The designated officer of the dispute case will be a member of the Grievance and Adjudication Committee.',
        'The officer reviews the timeline of the dispute resolution key activities provided by the committee and makes necessary preparations.'
      ]
    },
    {
      value: 'step4',
      title: 'Send out Dispute Letters',
      description:
        'The complainee(s) are informed of the dispute through official dispute letters.',
      details: [
        'The designated officer sends dispute letters to the complainee(s) via the MIS.',
        'The dispute letter outlines the nature of the dispute and the scheduled meeting details to deliberate on the most effective course of action for its resolution.'
      ]
    },
    {
      value: 'step5',
      title: 'Discussions and Activities for Resolution',
      description:
        'The complainee(s) and the assigned officer engage in discussions and activities aimed at resolving the dispute.',
      details: [
        'The designated officer communicates with the complainee(s) to discuss the dispute and potential resolutions.',
        'Activities may include mediation sessions, arbitration, or other conflict resolution methods as deemed appropriate.',
        'The designated officer submits progress reports outlining the activities performed until the dispute case reaches its resolution.'
      ]
    },
    {
      value: 'step6',
      title: 'Dispute Resolution with Corrective Actions',
      description:
        'The designated officer ensures that the agreed-upon resolution is carried out.',
      details: [
        'Upon reaching a resolution, the dispute is officially resolved, and corrective actions are implemented if necessary.',
        'If the dispute is not resolved successfully, the dispute case is elevated to the barangay.'
      ]
    }
  ]

  return (
    <div>
      <Box mb='1.5rem'>
        {/* Section Title */}
        <Text fontSize='xl' fontFamily='font.heading' fontWeight='bold'>
          Dispute Resolution
        </Text>
        {/* Section Description */}
        <Text fontSize='sm' fontFamily='font.body' color='grey'>
          You may click any step from the tabs list to view its detailed
          description.
        </Text>
      </Box>

      <Tabs defaultValue='step1' className='w-full'>
        <>
          <TabsList key='disputeStepTabs' className='grid w-full grid-cols-6'>
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
          The HOA maintains a comprehensive record of dispute reports and
          actions taken.
        </Text>
        <UnorderedList ml={7}>
          <ListItem>
            Comprehensive records of dispute reports and actions taken are
            maintained.
          </ListItem>
          <ListItem>
            Each dispute report is documented, including evidence, committee
            decisions, and resolution actions.
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
