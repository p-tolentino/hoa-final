import { ScrollArea } from '@/components/ui/scroll-area'
import { Box, Center, Flex, Stack, Text } from '@chakra-ui/react'
import React from 'react'

// Adding a prop type for EventDetails props
interface EventDetailsProps {
  title?: string
  date?: string
  venue?: string
  time?: string
  description?: string
}

export default function EventDetails ({
  title,
  date,
  venue,
  time,
  description
}: EventDetailsProps) {
  return (
    <Box mx={5} w='100%'>
      {title != null ? (
        <Box>
          <Text as='span' fontSize='lg' fontWeight='bold'>
            {title}
          </Text>
          <Flex pt={3} gap={2}>
            <Stack spacing={2} w='40%'>
              <Box>
                <Text fontWeight='semibold' mr='5px'>
                  Date and Time:
                </Text>
                <Text fontFamily='font.body'>
                  {date} ({time})
                </Text>
              </Box>
              <Box>
                <Text fontWeight='semibold' mr='5px'>
                  Venue:
                </Text>
                <Text fontFamily='font.body' fontSize='sm'>
                  {venue}
                </Text>
              </Box>
            </Stack>
            <Box w='55%'>
              <Text fontWeight='semibold' mb={1}>
                Event Description:
              </Text>
              <Box
                overflowY='auto'
                h='75px'
                border='1px solid lightgrey'
                borderRadius={5}
                p={3}
              >
                <Stack spacing={5}>
                  <Box pr='2rem'>
                    <Text fontFamily='font.body' fontSize='sm'>
                      {description}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Flex>
        </Box>
      ) : (
        <Center h='100%' fontFamily='font.body' color='grey'>
          Please select an event to view its details.
        </Center>
      )}
    </Box>
  )
}
