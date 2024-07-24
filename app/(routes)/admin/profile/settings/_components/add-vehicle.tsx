'use client'

import * as z from 'zod'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { VehicleSchema } from '@/server/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Flex } from '@chakra-ui/react'
import { Vehicle } from '@prisma/client'
import { ExtendedUser } from '@/next-auth'
import { addVehicle } from '@/server/actions/user-info'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { LuCar as Car } from 'react-icons/lu'
import { CellAction } from './cell-action'
import { AddIcon } from '@chakra-ui/icons'

interface AddVehicleProps {
  initialData: ExtendedUser
  vehicles: Vehicle[]
}

const AddVehicle: React.FC<AddVehicleProps> = ({ initialData, vehicles }) => {
  const router = useRouter()
  const { update } = useSession()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof VehicleSchema>>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: {
      plateNum: ''
    }
  })

  const onSubmit = async (values: z.infer<typeof VehicleSchema>) => {
    startTransition(() => {
      addVehicle(values)
        .then(data => {
          if (data.error) {
            console.log(data.error)
          }

          if (data.success) {
            update()
            form.reset()
            router.refresh()
            console.log(data.success)
          }
        })
        .catch(() => {
          console.log('Something went wrong.')
        })
    })
  }

  return (
    <div className='mt-2'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='align-end'>
          <FormField
            control={form.control}
            name='plateNum'
            render={({ field }) => (
              <div>
                <div>
                  <FormItem>
                    <FormLabel className='text-xl font-semibold'>
                      Vehicles Owned
                    </FormLabel>
                    <FormDescription>
                      Enter the plate number of your vehicle and the click Add
                      Vehicle button to add to your list of vehicles owned.
                    </FormDescription>
                    <Flex justifyContent='space-between' align='center'>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder='(ex: ZZZ-999)'
                          className='w-50'
                          {...field}
                        />
                      </FormControl>
                      <Button
                        disabled={isPending}
                        size='sm'
                        colorScheme='yellow'
                        leftIcon={<AddIcon />}
                        type='submit'
                      >
                        Add Vehicle
                      </Button>
                    </Flex>

                    <FormMessage />
                  </FormItem>
                </div>
                <ScrollArea className='h-40 border rounded-md mt-3'>
                  <div className='p-4'>
                    {vehicles.map(vehicle => (
                      <>
                        <div key={vehicle.id} className='flex justify-between'>
                          <div className='flex pt-1'>
                            <Car className='w-5 h-5 pt-1 mr-2' />
                            {vehicle.plateNum}
                          </div>
                          <CellAction data={vehicle} />
                        </div>
                        <Separator className='my-2' />
                      </>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

export default AddVehicle
