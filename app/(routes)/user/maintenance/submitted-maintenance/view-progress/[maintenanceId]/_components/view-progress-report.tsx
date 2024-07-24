'use client'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import {
  Text,
  Link,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Center,
  Flex,
  Stack
} from '@chakra-ui/react'
import { MaintenanceOfficerActivity, MaintenanceProgress } from '@prisma/client'
import { format } from 'date-fns'
import { useState } from 'react'

export default function ViewProgressReport ({
  activity,
  progressReports
}: {
  activity: MaintenanceOfficerActivity
  progressReports: MaintenanceProgress[]
}) {
  const [isOpen, setIsOpen] = useState(false) // Dialog open state

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Flex gap={3}>
          <Box>
            <Link color='blue.500'>{activity.title}</Link> <br />
            <span className='ml-2 text-sm text-gray-500'>
              {' (Deadline: '}
              {activity.deadline
                ? format(
                    new Date(activity.deadline)?.toISOString().split('T')[0],
                    'dd MMM yyyy'
                  )
                : ''}
              {')'}
            </span>
          </Box>
          <Badge
            className={cn(
              'w-[max-content] h-[min-content] px-2 py-0.5 text-center justify-center text-xs',
              !activity.isDone
                ? 'bg-yellow-700'
                : activity.isDone
                ? 'bg-green-700'
                : 'display-none'
            )}
          >
            {activity.isDone ? 'Done' : 'In Progress'}
          </Badge>
        </Flex>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Badge
            className={cn(
              'w-[max-content] h-[min-content] px-3 py-1 text-center justify-center text-xs mb-3',
              !activity.isDone
                ? 'bg-yellow-700'
                : activity.isDone
                ? 'bg-green-700'
                : 'display-none'
            )}
          >
            {activity.isDone ? 'Done' : 'In Progress'}
          </Badge>
          <Stack spacing={0.5}>
            <DialogTitle>{activity.title}</DialogTitle>
            <DialogDescription>Progress Report</DialogDescription>

            {progressReports.length != 0 && (
              <Text fontSize='sm' color='grey'>
                Date completed:{' '}
                {activity.dateCompleted
                  ? format(
                      new Date(activity.dateCompleted + 'Z')
                        ?.toISOString()
                        .split('T')[0],
                      'dd MMM yyyy'
                    )
                  : ''}
              </Text>
            )}
          </Stack>
        </DialogHeader>
        {progressReports.length ? (
          <>
            {/* Content for existing reports */}
            <Box fontSize='sm' fontFamily='font.body' mb='1rem'>
              <Accordion
                defaultIndex={[0]}
                allowMultiple
                mt='1.5rem'
                overflowY='auto'
                h='200px'
              >
                {progressReports?.map(report => (
                  <AccordionItem key={report.id}>
                    <AccordionButton>
                      <Box as='span' flex='1' textAlign='left'>
                        <Text fontSize='sm' fontWeight='semibold'>
                          {report.title}
                        </Text>
                        <Text fontSize='xs' color='grey'>
                          Date reported:{' '}
                          {report.dateSubmitted
                            ? format(
                                new Date(report.dateSubmitted + 'Z')
                                  ?.toISOString()
                                  .split('T')[0],
                                'dd MMM yyyy'
                              )
                            : ''}
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel fontSize='xs' pb={4}>
                      {report.description}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </>
        ) : (
          <Center
            fontSize='sm'
            color='lightgray'
            fontFamily='font.body'
            py='2rem'
            mb='2rem'
          >
            No reports to show yet.
          </Center>
        )}
      </DialogContent>
    </Dialog>
  )
}
