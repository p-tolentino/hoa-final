'use client'
import { Box, Text, UnorderedList, ListItem } from '@chakra-ui/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Hoa } from '@prisma/client'
import StepCard from './step-card'

export default function MaintenanceHandling ({ hoa }: { hoa: Hoa }) {
  const processSteps = [
    {
      value: 'step1',
      title: ' Maintenance Request Submission',
      description:
        'Homeowners submit maintenance requests through the Maintenance Handling module in the MIS.',
      details: [
        'Homeowners provide details about the type of maintenance required and a detailed description of its current condition.',
        'Supporting evidence such as photos or documents may be attached to the maintenance request.'
      ]
    },
    {
      value: 'step2',
      title: 'Review by Environment and Sanitation Committee',
      description:
        'The Environment and Sanitation Committee receives and reviews the maintenance request.',
      details: [
        'The Environment and Sanitation Committee assesses the request and conducts an assessment to determine corrective actions.',
        'The result of the assessment will provide the list of key activities to be followed by the officer assigned to oversee the maintenance activity, including the expected accomplishment date of each activity.'
      ]
    },
    {
      value: 'step3',
      title: 'Assign Officer to Oversee Maintenance Activity',
      description:
        'An officer is designated to oversee the handling of the maintenance activity.',
      details: [
        'The designated officer of the maintenance request will be a member of the Environment and Sanitation Committee.',
        'The officer reviews the timeline of the maintenance key activities provided by the committee and makes necessary preparations.'
      ]
    },
    {
      value: 'step4',
      title: 'Send out Maintenance Notice to HOA',
      description:
        'All homeowners are informed of the scheduled maintenance through an official maintenance notice.',
      details: [
        'The designated officer sends a maintenance notice to all homeowners via the MIS.',
        'The maintenance noptice outlines the details (i.e. maintenance tasks to be performed, date and duration of maintenance activity) of the scheduled maintenance that will be conducted.'
      ]
    },
    {
      value: 'step5',
      title: 'Submission of Maintenance Progress Reports',
      description:
        'The designated officer submits progress reports outlining the activities performed until the maintenance request has been handled and completed.',
      details: [
        'Activities may include contacting external manpower to assist in handling the maintenance activity.'
      ]
    },
    {
      value: 'step6',
      title: 'Submission of Maintenance Final Report',
      description:
        'The designated officer submits a final report of the status of the maintenance activity.',
      details: [
        'Upon completing all key activities, the maintenance request is officially completed.'
      ]
    }
  ]

  return (
    <div>
      <Box mb='1.5rem'>
        {/* Section Title */}
        <Text fontSize='xl' fontFamily='font.heading' fontWeight='bold'>
          Maintenance Handling
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
          The HOA maintains a comprehensive record of maintenance reports,
          actions taken, and maintenance fees spent.
        </Text>
        <UnorderedList ml={7}>
          <ListItem>
            Comprehensive records of maintenance reports, actions taken, and
            maintenance fees spent are maintained.
          </ListItem>
          <ListItem>
            Each maintenance request report is documented, including evidence,
            committee decisions, maintenance actions, and maintenance fees
            details.
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
