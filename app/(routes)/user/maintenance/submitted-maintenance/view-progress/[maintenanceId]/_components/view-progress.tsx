'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'
import { ButtonGroup } from '@chakra-ui/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StepCard from './step-card'
import BackButton from '@/components/system/BackButton'

interface ProgressDetailsProps {
  reportDetails: any
}

export const ProgressDetails: React.FC<ProgressDetailsProps> = ({
  reportDetails
}) => {
  // Page Title and Description
  const pageTitle = `#M${reportDetails.maintenance.number
    .toString()
    .padStart(4, '0')} - Maintenance Request Progress`
  const pageDescription = `View the progress of a selected maintenance ticket within the Homeowners' Association.`

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
      <Heading
        title={pageTitle}
        description={pageDescription}
        leftElements={
          // Status
          <Badge
            className={cn(
              'w-[max-content] h-[min-content] px-3 py-2 text-center justify-center text-sm',
              reportDetails.maintenance.status === 'For Review'
                ? 'bg-yellow-700'
                : reportDetails.maintenance.status === 'For Assignment'
                ? 'bg-yellow-800'
                : reportDetails.maintenance.status ===
                  'Pending Maintenance Notice'
                ? 'bg-orange-800'
                : reportDetails.maintenance.status === 'Maintenance in Progress'
                ? 'bg-blue-900'
                : reportDetails.maintenance.status === 'For Final Report'
                ? 'bg-violet-500'
                : reportDetails.maintenance.status === 'Completed'
                ? 'bg-green-700'
                : reportDetails.maintenance.status === 'Closed' &&
                  reportDetails.maintenance.reasonToClose ===
                    ('Insufficient Evidence' || 'Duplicate Submission')
                ? 'bg-red-800'
                : ''
            )}
          >
            {reportDetails.maintenance.status}
            {reportDetails.maintenance.reasonToClose &&
              `(${reportDetails.maintenance.reasonToClose})`}
          </Badge>
        }
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <Tabs
        defaultValue={'step' + reportDetails.maintenance.step}
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-6'>
          {processSteps.map((step, index) => (
            <TabsTrigger
              key={step.value}
              value={step.value}
              disabled={index >= reportDetails.maintenance.step}
            >
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
              reportDetails={reportDetails}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default ProgressDetails
