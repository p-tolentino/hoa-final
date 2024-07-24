'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Avatar,
  Box,
  Flex,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList
} from '@chakra-ui/react'
import { format, isSameMonth, parseISO, getMonth } from 'date-fns'

import { PersonalInfo, User, Events } from '@prisma/client'

interface AnnouncementProps {
  personalInfo: PersonalInfo[]
  events: Events[]
  user: string
}

export default function AnnouncementBoard ({
  personalInfo,
  events,
  user
}: AnnouncementProps) {
  // Get Current Month
  const currentDate = new Date()
  const currentMonth = getMonth(currentDate) // This gets the current month as a zero-based index (0 = January, 11 = December)
  const currentMonthName = format(currentDate, 'LLLL')

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const monthName = monthNames[currentMonth]

  const monthCelebrants = personalInfo
    .filter(info => {
      if (!info.birthDay) return false // Skip if birthday is not defined

      // Parse the birthday to a Date object if it's a string, otherwise use it directly
      const birthDate =
        typeof info.birthDay === 'string'
          ? new Date(info.birthDay)
          : info.birthDay

      return getMonth(birthDate) === currentMonth
    })
    .map(celebrant => {
      const birthDate =
        typeof celebrant.birthDay === 'string'
          ? new Date(celebrant.birthDay)
          : celebrant.birthDay
      const birthDay = birthDate?.getDate() // Get the day of the month
      return {
        avatar: `${celebrant.imageUrl}`,
        name: `${celebrant.firstName} ${celebrant.lastName}`.trim(),
        birthDay, // Save the day of the month for later display
        position: `${celebrant.position}`
        // Additional properties and adjustments can be made here as needed
      }
    })
    .sort((a, b) => {
      return (a.birthDay as number) - (b.birthDay as number)
    })

  const currentMonthEvents = events
    .filter(event => isSameMonth(new Date(event.date), currentDate)) // Ensure we're only dealing with current month's events
    .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate())
  return (
    <>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>Announcements</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <UnorderedList fontFamily='font.body'>
            <ListItem key={'BirthdayCelebrants'}>
              {/* Homeowner Birthday Celebrants */}
              <Dialog>
                <DialogTrigger asChild>
                  <Link fontSize='sm'>
                    {currentMonthName} Birthday Celebrants{' '}
                    <Text as='span' fontWeight='bold'>
                      ({monthCelebrants.length})
                    </Text>
                  </Link>
                </DialogTrigger>
                <DialogContent className='max-h-[500px]  overflow-y-auto'>
                  <DialogHeader>
                    <DialogTitle>
                      {currentMonthName} Birthday Celebrants
                    </DialogTitle>
                    <DialogDescription>
                      Below are the birthday celebrants for the month.
                    </DialogDescription>
                  </DialogHeader>
                  <Stack fontFamily='font.body' pb={5} spacing={5}>
                    {monthCelebrants.map((celebrant, index) => (
                      <Flex key={index} align='center' gap={3}>
                        <Avatar
                          name={celebrant.name}
                          src={celebrant.avatar}
                          boxSize={10}
                        />
                        <Box lineHeight={1.2}>
                          {celebrant.name} ({monthName} {celebrant.birthDay})
                          <Text fontSize='xs' color='grey'>
                            {celebrant.position}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </Stack>
                </DialogContent>
              </Dialog>
            </ListItem>
            {currentMonthEvents.map(event => (
              <ListItem key={event.id}>
                <Dialog>
                  {/* Event Title */}
                  <DialogTrigger asChild>
                    <Link fontSize='sm'>{event.title}</Link>
                  </DialogTrigger>
                  <DialogContent className='max-h-[500px]  overflow-y-auto'>
                    <DialogHeader>
                      <DialogTitle className='text-xl'>
                        {event.title}
                      </DialogTitle>
                    </DialogHeader>
                    <Box h='full'>
                      <ScrollArea className='h-[450px] rounded-md'>
                        <Stack spacing={3} p={4}>
                          <Box>
                            <Text as='span' fontWeight='semibold'>
                              Date and Time:{' '}
                            </Text>
                            <Text as='span'>
                              {format(new Date(event.date), 'MMMM dd, yyyy')} (
                              {format(new Date(event.date), 'p')})
                            </Text>{' '}
                            {/* Format the event.date */}
                          </Box>
                          <Box>
                            <Text as='span' fontWeight='semibold'>
                              Venue:{' '}
                            </Text>
                            <Text as='span'>{event.venue}</Text>{' '}
                            {/* Display the event.venue */}
                          </Box>
                          <Box pr='2rem'>
                            <Text fontWeight='semibold'>
                              Event Description:
                            </Text>
                            <Text textAlign='justify'>
                              {event.description}{' '}
                              {/* Display the event.description */}
                            </Text>
                          </Box>
                        </Stack>
                      </ScrollArea>
                    </Box>
                  </DialogContent>
                </Dialog>
              </ListItem>
            ))}
          </UnorderedList>
        </CardContent>
      </Card>
    </>
  )
}
