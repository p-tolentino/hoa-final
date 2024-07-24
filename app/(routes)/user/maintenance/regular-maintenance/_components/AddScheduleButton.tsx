'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Input,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  FormHelperText,
  Flex,
  Select
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createRegularMaintainService } from '@/server/actions/maintenance-sched'
import { Form, FormField } from '@/components/ui/form'
import { Facility } from '@prisma/client'

export const ScheduleFormSchema = z.object({
  title: z.string(),
  facilityId: z.string(),
  days: z.string(),
  startTime: z.string(),
  endTime: z.string()
})

export type ScheduleFormValues = z.infer<typeof ScheduleFormSchema>

export default function AddSchedule ({
  facilities
}: {
  facilities: Facility[] | null | undefined
}) {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [facilityId, setFacilityId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const router = useRouter()

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(ScheduleFormSchema),
    defaultValues: {
      title: '',
      facilityId: '',
      days: '',
      startTime: '',
      endTime: ''
    }
  })

  const toast = useToast()

  const onSubmit = async (values: ScheduleFormValues) => {
    const daysOrder = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ]

    const sortedSelectedDays = selectedDays.sort((a, b) => {
      return daysOrder.indexOf(a) - daysOrder.indexOf(b)
    })

    const days = sortedSelectedDays.join(',')
    const data = {
      ...values,
      facilityId,
      days,
      startTime,
      endTime
    }

    await createRegularMaintainService(data)
      .then(data => {
        if (data.success) {
          toast({
            title: `Regular Maintenance Schedule Added.`,
            description: `${form.watch('title')}`,
            status: 'success',
            position: 'bottom-right',
            isClosable: true
          })
        }
      })
      .then(() => {
        form.reset()
        setSelectedDays([])
        setFacilityId('')
        setStartTime('')
        setEndTime('')
        router.refresh()
      })
  }

  const handleDaysChange = (day: string) => {
    setSelectedDays(prevSelectedDays =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter(d => d !== day)
        : [...prevSelectedDays, day]
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          <AddIcon boxSize={3} mr='10px' />
          New Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Schedule</DialogTitle>
              <DialogDescription>
                Fill up the following fields to add a new regular facility
                maintenance schedule.
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <Stack spacing='15px' my='1.5rem' fontFamily='font.body'>
              <Stack>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormControl isRequired as={Flex} alignItems='top'>
                      <FormLabel>Activity Title:</FormLabel>
                      <Textarea
                        resize='none'
                        w='75%'
                        overflowY='auto'
                        {...field}
                      ></Textarea>
                    </FormControl>
                  )}
                />
                <FormControl isRequired as={Flex} alignItems='center'>
                  <FormLabel>Facility:</FormLabel>
                  <Select
                    placeholder='Select a facility'
                    size='sm'
                    onChange={e => setFacilityId(e.target.value)}
                  >
                    {facilities?.map(facility => (
                      <option key={facility.id} value={facility.id}>
                        {facility.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <FormControl isRequired>
                <Flex gap={2} justifyContent='center'>
                  {[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                  ].map(day => (
                    <Button
                      key={day}
                      colorScheme={
                        selectedDays.includes(day) ? 'yellow' : 'gray'
                      }
                      onClick={() => handleDaysChange(day)}
                    >
                      {day[0]}
                      {day.length > 3 && day.slice(1, 2)}
                    </Button>
                  ))}
                </Flex>
              </FormControl>
              <Flex gap={5}>
                <FormControl isRequired>
                  <Stack spacing={1} w='full'>
                    <FormHelperText>Start Time:</FormHelperText>
                    <Input
                      type='time'
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                    />
                  </Stack>
                </FormControl>
                <FormControl isRequired>
                  <Stack spacing={1} w='full'>
                    <FormHelperText>End Time:</FormHelperText>
                    <Input
                      type='time'
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                    />
                  </Stack>
                </FormControl>
              </Flex>
            </Stack>

            <DialogFooter className='text-right'>
              <FormControl>
                <Button size='sm' colorScheme='yellow' type='submit'>
                  Add New Schedule
                </Button>
              </FormControl>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
