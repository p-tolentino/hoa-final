import * as React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Table, Tbody, Tr, Td, Center, Box } from '@chakra-ui/react'

import { useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import EventDetails from './EventDetails'

import { Text } from '@chakra-ui/react'
import { format, getYear, getMonth } from 'date-fns'
import { Events, User } from '@prisma/client'
import { Separator } from '@/components/ui/separator'

const getMonthYearFromIndex = (index: number) => {
  let year = getYear(new Date())

  return format(new Date(year, index, 1), 'LLLL RRRR')
}

interface EventProps {
  events: Events[]
  user: string
}

export function MonthlyEventList ({ events, user }: EventProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedEvent, setSelectedEvent] = useState<Events | null>(null)

  const handleEventClick = (event: Events) => {
    setSelectedEvent(event)
    onOpen()
  }

  const handleMonthEvents = (monthIndex: number) => {
    return events
      .filter(event => getMonth(new Date(event.date)) === monthIndex)
      .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate())
  }

  return (
    <div>
      <Box mx={10} maxW='50vw'>
        <Carousel>
          <CarouselContent className='pl-1 -ml-1'>
            {Array.from({ length: 12 }).map((_, index) => (
              <CarouselItem key={index} className='px-0 basis-1/4'>
                <div className='p-1'>
                  <Card className='h-[150px]'>
                    {/* Monthly Events */}
                    <CardContent className='p-3'>
                      <Text size='xl' fontWeight='semibold' mb='10px'>
                        {getMonthYearFromIndex(index)}
                      </Text>
                      {handleMonthEvents(index).length > 0 ? (
                        <Box
                          overflowY='auto'
                          overflowX='hidden'
                          h='88px'
                          pr={2}
                        >
                          <Table size='sm' variant='striped'>
                            <Tbody>
                              {handleMonthEvents(index).map(
                                (event, eventIndex) => (
                                  <Tr key={eventIndex}>
                                    <Td w='75px' fontWeight='semibold' pr='0'>
                                      {format(new Date(event.date), 'MMM dd')}
                                    </Td>
                                    <Td
                                      pl='5px'
                                      onClick={() => handleEventClick(event)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {event.title}
                                    </Td>
                                  </Tr>
                                )
                              )}
                            </Tbody>
                          </Table>
                        </Box>
                      ) : (
                        // Scenario: No events to show for the month
                        <Center
                          h='80px'
                          color='grey'
                          fontFamily='font.body'
                          fontSize='sm'
                        >
                          No events to show.
                        </Center>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Box>

      <Separator className='mt-5 mb-5' />
      {selectedEvent ? (
        <EventDetails
          title={selectedEvent.title}
          date={format(new Date(selectedEvent.date), 'MMMM dd, yyyy')}
          time={format(new Date(selectedEvent.date), 'p')}
          venue={selectedEvent.venue}
          description={selectedEvent.description}
        />
      ) : (
        <EventDetails />
      )}
    </div>
  )
}
