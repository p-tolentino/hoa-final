'use client'

import { Heading } from '@/components/ui/heading'
import { useRouter } from 'next/navigation'
import React from 'react'
import BackButton from '@/components/system/BackButton'
import AddScheduleButton from './AddScheduleButton'
import EditScheduleButton from './EditScheduleButton'
import DeleteScheduleButton from './DeleteScheduleButton'
import {
  Facility,
  MaintenanceSchedule,
  RegularMaintainService
} from '@prisma/client'
import {
  Flex,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  ButtonGroup,
  Text,
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  Stack
} from '@chakra-ui/react'

type MaintenanceScheduleWithService = MaintenanceSchedule & {
  service: RegularMaintainService
}

export const convertTimeTo12HourFormat = (time: any) => {
  let [hour, minute] = time.split(':')
  hour = parseInt(hour)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${minute} ${ampm}`
}

const MaintenanceSchedules = ({
  schedules,
  facilities
}: {
  schedules: MaintenanceScheduleWithService[] | null | undefined
  facilities: Facility[] | null | undefined
}) => {
  // Page Title and Description
  const pageTitle = 'Regular Facility Maintenance'
  const pageDescription =
    "Manage the schedules for regular facility schedule within the Homeowners' Association."

  const router = useRouter()

  const formatDays = (days: string) => {
    const dayList = days.split(',')
    if (dayList.length === 1) return `Every ${dayList[0]}`
    if (dayList.length === 2) return `Every ${dayList.join(' and ')}`
    if (dayList.length === 7) return `Everyday`
    return `Every ${dayList.slice(0, -1).join(', ')}, and ${
      dayList[dayList.length - 1]
    }`
  }

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <AddScheduleButton facilities={facilities} />
            <BackButton />
          </ButtonGroup>
        }
      />

      <Grid templateColumns='repeat(2, 1fr)' gap={6}>
        {schedules?.map(schedule => (
          <GridItem key={schedule.id}>
            <Card pb={2}>
              <CardHeader pb={1} as={Flex} justifyContent='space-between'>
                <Stack lineHeight={1}>
                  <Text fontWeight='bold' fontSize='md'>
                    {schedule?.service.title}
                  </Text>
                  <Text fontWeight='semibold' fontSize='sm' color='grey'>
                    {
                      facilities?.find(
                        facility => facility.id === schedule?.service.facilityId
                      )!!.name
                    }
                  </Text>
                </Stack>
                <ButtonGroup>
                  <EditScheduleButton
                    schedule={schedule}
                    facilities={facilities}
                  />
                  <DeleteScheduleButton
                    schedule={schedule}
                    facilities={facilities}
                    days={formatDays(schedule.days)}
                    continueDeletion={confirmed => {
                      if (confirmed) {
                        router.refresh()
                      }
                    }}
                  />
                </ButtonGroup>
              </CardHeader>
              <CardBody fontFamily='font.body' pt={1.5}>
                <TableContainer>
                  <Table size='sm'>
                    <Tbody>
                      <Tr>
                        <Td fontWeight='semibold'>Days:</Td>
                        <Td>{formatDays(schedule.days)}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight='semibold'>Start Time:</Td>
                        <Td>{convertTimeTo12HourFormat(schedule.startTime)}</Td>
                      </Tr>
                      <Tr>
                        <Td fontWeight='semibold'>End Time:</Td>
                        <Td>{convertTimeTo12HourFormat(schedule.endTime)}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </>
  )
}

export default MaintenanceSchedules
