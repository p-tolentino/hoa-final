'use client'

import { useForm } from 'react-hook-form'
import { Heading } from '@/components/ui/heading'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCurrentUser } from '@/hooks/use-current-user'
import { createReservation } from '@/server/actions/facility-reservation'
import { useEffect, useState } from 'react'
import { FacilityReservationSchema } from '@/server/schemas'
import {
  Facility,
  FacilityReservation,
  MaintenanceSchedule,
  MaintenanceNotice,
  Hoa
} from '@prisma/client'
import * as z from 'zod'
import DatePicker from 'react-datepicker'
import BackButton from '@/components/system/BackButton'
import 'react-datepicker/dist/react-datepicker.css'
import {
  Input,
  Text,
  Button,
  Box,
  Stack,
  Flex,
  FormControl,
  FormLabel,
  ButtonGroup,
  SimpleGrid,
  UnorderedList,
  ListItem
} from '@chakra-ui/react'
import { Form, FormField } from '@/components/ui/form'

type FacilityReservationValues = z.infer<typeof FacilityReservationSchema>

interface ReservationProps {
  facility: Facility | null
  reservations: FacilityReservation[]
  regMaintenance: MaintenanceSchedule[]
  maintenance: MaintenanceNotice[]
  hoaInfo: Hoa
}

export default function ReservationForm ({
  facility,
  reservations,
  regMaintenance,
  maintenance,
  hoaInfo
}: ReservationProps) {
  // Page Title and Description
  const pageTitle = `Facility Reservation Form: ${facility?.name}`
  const pageDescription = `Fill out the required fields to reserve a facility in the Homeowners' Assocation.`

  const user = useCurrentUser()
  const router = useRouter()
  const [numHours, setNumHours] = useState(0)
  const [totalFee, setTotalFee] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const form = useForm<FacilityReservationValues>({
    resolver: zodResolver(FacilityReservationSchema),
    defaultValues: {
      facilityId: facility?.id || undefined,
      userId: user?.id || undefined,
      startTime: new Date() || undefined,
      endTime: new Date() || undefined,
      numHours: '' || undefined,
      reservationFee: '' || undefined
    }
  })

  const { watch, setValue } = form
  const startTime = watch('startTime')
  const endTime = watch('endTime')

  useEffect(() => {
    if (startTime && endTime && facility) {
      const start = new Date(startTime)
      const end = new Date(endTime)
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60) // Duration in hours
      setNumHours(duration)

      const fee = duration * facility.hourlyRate
      setTotalFee(fee)
      setValue('numHours', duration.toString())
      setValue('reservationFee', fee.toString())
    }
  }, [startTime, endTime, facility, setValue])

  const isTimeReserved = (date: Date) => {
    // Get current date and time
    const now = new Date()
    //console.log("Current time:", now);
    //console.log("Selected time:", date);

    // Check if the date is in the past. If so, disable it.
    if (date < now) {
      // console.log("Time is in the past");
      return false
    }

    // Operational hours: 7:00 AM to 11:59 PM
    const hour = date.getHours()
    console.log('Selected hour:', hour)
    if (hour < 7 || hour >= 24) {
      // console.log("Time is outside operational hours");
      return false // Disables times outside operational hours
    }

    const isMaintenance = regMaintenance.some(maintenance => {
      const maintenanceDays = maintenance.days.split(',')
      const day = date.toLocaleString('en-us', { weekday: 'long' })

      const startTime = new Date(date)
      const [startHour, startMinute] = maintenance.startTime
        .split(':')
        .map(Number)
      startTime.setHours(startHour, startMinute, 0, 0)

      const endTime = new Date(date)
      const [endHour, endMinute] = maintenance.endTime.split(':').map(Number)
      endTime.setHours(endHour, endMinute, 0, 0)

      return (
        maintenanceDays.includes(day) && date >= startTime && date < endTime
      )
    })

    if (isMaintenance) {
      return false // Disable times during maintenance
    }

    // Check special maintenance
    const isSpecialMaintenance = maintenance.some(maint => {
      const startDateTime = new Date(maint.startDate)
      const [startHour, startMinute] = maint.startTime.split(':').map(Number)
      startDateTime.setHours(startHour, startMinute, 0, 0)

      const endDateTime = new Date(maint.endDate)
      const [endHour, endMinute] = maint.endTime.split(':').map(Number)
      endDateTime.setHours(endHour, endMinute, 0, 0)

      return date >= startDateTime && date <= endDateTime
    })

    if (isSpecialMaintenance) {
      return false // Disable times during special maintenance
    }

    // Check if the date falls within or overlaps any reserved time intervals.
    const isReserved = reservations.some(reservation => {
      const reservedStart = new Date(reservation.startTime)
      const reservedEnd = new Date(reservation.endTime)
      return (
        (date >= reservedStart && date < reservedEnd) ||
        (date <= reservedEnd && date > reservedStart)
      )
    })
    // console.log("Is reserved:", isReserved);

    return !isReserved // Enable if not reserved
  }

  const onSubmit = async (values: FacilityReservationValues) => {
    setIsButtonClicked(true)
    if (user?.status === 'DELINQUENT') {
      setErrorMessage(
        'You are delinquent and cannot access facility reservation.'
      )
      return // Stop the submission process
    }

    // Get the current time and remove seconds and milliseconds for comparison
    const now = new Date()
    now.setSeconds(0, 0)

    const start = new Date(values.startTime)
    const end = new Date(values.endTime)

    // Check if the startTime is in the past
    if (start < now) {
      setErrorMessage('The start time cannot be in the past.')
      return // Stop the submission process
    }

    // Check if the endTime is before the startTime
    if (end <= start) {
      setErrorMessage('The end time must be after the start time.')
      return // Stop the submission process
    }

    // Check for overlapping reservations
    const isOverlapping = reservations.some(reservation => {
      const reservedStart = new Date(reservation.startTime)
      const reservedEnd = new Date(reservation.endTime)
      return start < reservedEnd && end > reservedStart
    })

    if (isOverlapping) {
      setErrorMessage(
        'The selected time range overlaps with an existing reservation.'
      )
      return // Stop the submission process
    }

    // If no error, clear any previous error messages
    setErrorMessage('')

    // Continue with submitting the form
    // Here you would typically send the data to your server or handle it as required
    try {
      await createReservation(values) // Assume createPost is an async operation
      form.reset() // Reset form upon success
      router.push('/user/facility/reservation-user')
    } catch (error) {
      console.error('Failed to add new facility:', error)
      // Handle error state here, if needed
    }
    console.log('Form submitted with values:', values)
  }

  const formatNumber = (value: number | undefined): string => {
    if (value === undefined) {
      return 'Undefined' // Default value if `value` is undefined
    }

    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount

    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(numericAmount)
  }

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            <BackButton />
          </ButtonGroup>
        }
      />

      <Box fontSize='sm'>
        <Text fontWeight='semibold' color='grey'>
          Reminders:
        </Text>
        <UnorderedList fontFamily='font.body'>
          <ListItem>
            {/* Facility Maintenance Notice */}
            <Text color='grey'>
              Please be advised that the facilities unavailable times are either
              already reserved or have a scheduled maintenance activity on that
              time.
            </Text>
          </ListItem>
          <ListItem>
            {/* Cancellation Notice */}
            <Text color='grey'>
              <span className='font-semibold'>Cancellation Policy:</span> You
              can cancel your reservation up to {hoaInfo.cancelPeriod} days
              before the start time. A cancellation fee of
              {formatCurrency(hoaInfo.cancellationFee)} will be charged for
              cancellations made within this period.{' '}
              <span className='flex text-red-700 font-semibold'>
                Cancellation of reservations are only available{' '}
                {hoaInfo.cancelPeriod} days before the reserved date. Cancelling
                any reservations will also charge you a cancellation fee of{' '}
                {formatCurrency(hoaInfo.cancellationFee)}.
              </span>
            </Text>
          </ListItem>
        </UnorderedList>
      </Box>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {user?.status === 'DELINQUENT' && (
        <div style={{ color: 'red.500', marginTop: 5 }}>
          You are not authorized to access our facilities because you are marked
          as a delinquent homeowner. Please address any outstanding fees on your
          account.
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Box py={4} w='max-content' fontFamily='font.body' mt={5}>
            <SimpleGrid columns={2} gap={5}>
              <Box>
                <Flex ml={5} gap={5}>
                  {/* Start Date and Time */}
                  <FormField
                    control={form.control}
                    name='startTime'
                    render={({
                      field: { onChange, onBlur, value, ref, name }
                    }) => (
                      <FormControl isRequired>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Start Date and Time:
                        </FormLabel>
                        <DatePicker
                          className='border p-1'
                          selected={value || new Date()} // Ensures a Date object is used
                          onChange={onChange} // Handles date changes
                          onBlur={onBlur} // Handles blur events
                          name={name} // Maintains field name
                          showTimeSelect
                          timeFormat='HH:mm'
                          timeIntervals={30}
                          dateFormat='MMMM d, yyyy h:mm aa'
                          filterTime={isTimeReserved} // Filters out reserved and past times within the day
                          minDate={new Date()} // Ensures no past dates are selectable
                          ref={ref} // Connects the input ref
                          popperPlacement='bottom-start'
                        />
                      </FormControl>
                    )}
                  />
                  {/* End Date and Time */}
                  <FormField
                    control={form.control}
                    name='endTime'
                    render={({
                      field: { onChange, onBlur, value, ref, name }
                    }) => (
                      <FormControl isRequired>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          End Date and Time:
                        </FormLabel>
                        <DatePicker
                          className='border p-1'
                          selected={value || new Date()} // Ensures a Date object is used
                          onChange={onChange} // Handles date changes
                          onBlur={onBlur} // Handles blur events
                          name={name} // Maintains field name
                          showTimeSelect
                          timeFormat='HH:mm'
                          timeIntervals={30}
                          dateFormat='MMMM d, yyyy h:mm aa'
                          filterTime={isTimeReserved} // Filters out reserved and past times within the day
                          minDate={new Date()} // Ensures no past dates are selectable
                          ref={ref} // Connects the input ref
                          popperPlacement='bottom-start'
                        />
                      </FormControl>
                    )}
                  />
                </Flex>

                <Button
                  size='sm'
                  type='submit'
                  colorScheme='yellow'
                  mx={5}
                  mt={7}
                  isLoading={isButtonClicked}
                  loadingText='Submitting'
                  isDisabled={totalFee === 0 || user?.status === 'DELINQUENT'}
                >
                  Submit Reservation Form
                </Button>
              </Box>
              <Box
                border='1px solid lightgrey'
                borderRadius={5}
                boxShadow='md'
                p={5}
              >
                <Text
                  fontWeight='bold'
                  mb={3}
                  fontFamily='font.heading'
                  textAlign='center'
                  color='brand.500'
                >
                  RESERVATION DETAILS:
                </Text>
                <SimpleGrid columns={2} gap={5}>
                  {/* Select Function Hall */}
                  <FormControl>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Facility Selected:
                    </FormLabel>
                    <Input
                      fontSize='lg'
                      fontWeight='semibold'
                      value={facility?.name}
                      isReadOnly
                      border='none'
                      p={0}
                    />
                  </FormControl>
                  {/* Reservation Fee */}
                  <Stack spacing={3} w='100%'>
                    <Text fontSize='sm' fontWeight='semibold'>
                      Reservation Fee:
                    </Text>
                    <Text fontSize='lg' fontWeight='semibold'>
                      {facility?.hourlyRate === undefined ? (
                        formatNumber(facility?.hourlyRate)
                      ) : (
                        <>
                          {formatCurrency(facility?.hourlyRate)}{' '}
                          <span className='sub text-sm font-normal'>
                            / Hour
                          </span>{' '}
                        </>
                      )}
                    </Text>
                  </Stack>
                  {/* Number of Hours */}
                  <FormControl>
                    <FormLabel fontSize='sm' fontWeight='semibold' mb={0}>
                      Number of Hours:
                    </FormLabel>
                    <Input
                      w='min-content'
                      fontSize='lg'
                      fontWeight='semibold'
                      value={numHours.toFixed(2)} // Formats to 2 decimal places
                      isReadOnly
                      border={0}
                      p={0}
                      color={numHours === 0 ? 'grey' : 'initial'}
                    />
                  </FormControl>
                  {/* Total Reservation Fee */}
                  <FormControl>
                    <FormLabel fontSize='sm' fontWeight='semibold' mb={0}>
                      Total Reservation Fee:
                    </FormLabel>
                    <Input
                      w='min-content'
                      fontSize='lg'
                      fontWeight='semibold'
                      value={`₱ ${formatNumber(totalFee)}`} // Formats to 2 decimal places
                      isReadOnly
                      border={0}
                      p={0}
                      color={totalFee === 0 ? 'grey' : 'red'}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            </SimpleGrid>
          </Box>
        </form>
      </Form>
    </>
  )
}
