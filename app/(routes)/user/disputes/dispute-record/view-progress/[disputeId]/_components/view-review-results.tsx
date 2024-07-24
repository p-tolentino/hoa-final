import { Box, Flex, ListItem, OrderedList, Text } from '@chakra-ui/react'
import { DisputeOfficerActivity } from '@prisma/client'
import { format } from 'date-fns'

export default function ViewReviewResults ({
  reportDetails
}: {
  activeStep: number
  reportDetails: any
}) {
  return (
    <Flex gap={10}>
      <Box>
        <Flex justifyContent='space-between'>
          <Box>
            <Text
              fontWeight='semibold'
              fontFamily='font.heading'
              lineHeight={1}
            >
              Dispute Case: Review Results
            </Text>
            <Text fontFamily='font.body' fontSize='sm' color='grey'>
              Date created:{' '}
              {reportDetails.dispute.commReviewDate
                ? format(
                    new Date(reportDetails.dispute.commReviewDate + 'Z')
                      ?.toISOString()
                      .split('T')[0],
                    'dd MMM yyyy'
                  )
                : ''}
            </Text>
          </Box>
        </Flex>
        <Box
          h='120px'
          border='1px solid lightgray'
          borderRadius={5}
          p={3}
          overflowY='auto'
          mt='1rem'
          w='500px'
        >
          <Text fontFamily='font.body' fontSize='sm' textAlign='justify'>
            {reportDetails.dispute.committeeReview}
          </Text>
        </Box>
      </Box>
      <Box>
        <Box>
          <Text fontWeight='semibold' fontFamily='font.heading' lineHeight={1}>
            Key Activities for Officer Assigned
          </Text>
          <Text fontFamily='font.body' fontSize='sm' color='grey'>
            Date created:{' '}
            {reportDetails.dispute.commReviewDate
              ? format(
                  new Date(reportDetails.dispute.commReviewDate + 'Z')
                    ?.toISOString()
                    .split('T')[0],
                  'dd MMM yyyy'
                )
              : ''}
          </Text>
        </Box>
        <Box
          h='120px'
          border='1px solid lightgray'
          borderRadius={5}
          p={3}
          overflowY='auto'
          mt='1rem'
          w='500px'
        >
          <OrderedList fontSize='sm' fontFamily='font.body' spacing={3}>
            {reportDetails.officerActivities
              .sort((a: any, b: any) => a.deadline - b.deadline)
              .map((activity: DisputeOfficerActivity) => (
                <ListItem key={activity.id}>
                  {activity.title}
                  <br />
                  <span className='ml-2 text-sm text-gray-500'>
                    {' (Deadline: '}
                    {activity.deadline
                      ? format(
                          new Date(activity.deadline)
                            ?.toISOString()
                            .split('T')[0],
                          'dd MMM yyyy'
                        )
                      : ''}
                    {')'}
                  </span>
                </ListItem>
              ))}
          </OrderedList>
        </Box>
      </Box>
    </Flex>
  )
}
