import { Box, Flex, ListItem, OrderedList, Stack, Text } from '@chakra-ui/react'
import { ViolationOfficerActivity } from '@prisma/client'
import { format } from 'date-fns'

export default function ViewReviewResults ({
  reportDetails
}: {
  activeStep: number
  reportDetails: any
}) {
  return (
    <Stack spacing={5}>
      <Flex gap={10}>
        <Box>
          <Flex justifyContent='space-between'>
            <Box>
              <Text
                fontWeight='semibold'
                fontFamily='font.heading'
                lineHeight={1}
              >
                Violation Case: Review Results
              </Text>
              <Text fontFamily='font.body' fontSize='sm' color='grey'>
                Date created:{' '}
                {reportDetails.violation.commReviewDate
                  ? format(
                      new Date(reportDetails.violation.commReviewDate + 'Z')
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
              {reportDetails.violation.committeeReview}
            </Text>
          </Box>
        </Box>
        <Box>
          <Box>
            <Text
              fontWeight='semibold'
              fontFamily='font.heading'
              lineHeight={1}
            >
              Key Activities for Officer Assigned
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
                .map((activity: ViolationOfficerActivity) => (
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
    </Stack>
  )
}
