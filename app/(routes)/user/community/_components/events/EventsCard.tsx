'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Flex, HStack } from '@chakra-ui/react'
import React from 'react'
import { MonthlyEventList } from './_components/MonthlyEventList'
import CreateEventButton from './_components/CreateEventButton'
import { Events, Facility } from '@prisma/client'

interface EventProps {
  events: Events[]
  user: string
  facilities: Facility[]
}

export default function EventsCard ({ events, user, facilities }: EventProps) {
  return (
    <div>
      <Card className='w-[57.8vw] h-[68vh]'>
        <Flex justifyContent='space-between'>
          <CardHeader>
            <CardTitle className='font-bold'>Events</CardTitle>
            <CardDescription>
              View the Community Calendar of the current year.
            </CardDescription>
          </CardHeader>
          <HStack p='20px'>
            {/* Create Event Button*/}
            <CreateEventButton user={user} facilities={facilities} />
          </HStack>
        </Flex>
        <CardContent className='space-y-2 w-[100%] '>
          <MonthlyEventList events={events} user={user} />
          {/* <EventDetails /> */}
        </CardContent>
      </Card>
    </div>
  )
}
