'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'

import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  SimpleGrid
} from '@chakra-ui/react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { PersonalInfoSchema } from '@/server/schemas'
import { useSession } from 'next-auth/react'
import { updateInfo } from '@/server/actions/user-info'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { HomeRelation, Property } from '@prisma/client'
import { Textarea } from '@/components/ui/textarea'
import { FaUser as User } from 'react-icons/fa'
import { UploadDp } from './upload-dp'
import { useCurrentUser } from '@/hooks/use-current-user'
import { EditIcon } from '@chakra-ui/icons'

interface SettingsFormProps {
  properties: Property[]
}

type SettingsFormValues = z.infer<typeof PersonalInfoSchema>

export const SettingsForm: React.FC<SettingsFormProps> = ({ properties }) => {
  const user = useCurrentUser()
  const router = useRouter()
  const { update } = useSession()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: {
      firstName: user?.info?.firstName || undefined,
      middleName: user?.info?.middleName || undefined,
      lastName: user?.info?.lastName || undefined,
      birthDay: user?.info?.birthDay
        ? new Date(user?.info?.birthDay).toISOString().split('T')[0]
        : undefined,
      phoneNumber: user?.info?.phoneNumber || '',
      type: user?.info?.type || undefined,
      address: user?.info?.address || undefined,
      relation: user?.info?.relation || undefined
    }
  })

  const onSubmit = async (values: SettingsFormValues) => {
    startTransition(() => {
      updateInfo(values)
        .then(data => {
          if (data.error) {
            console.log(data.error)
          }

          if (data.success) {
            form.reset({
              ...values
            })
            router.push('/user/settings')
            update()
            router.refresh()
            console.log(data.success)
          }
        })
        .catch(error => {
          console.log('Something went wrong.')
          throw error
        })
    })
  }

  return (
    <Box fontFamily='font.body'>
      <UploadDp isOpen={open} onClose={() => setOpen(false)} user={user!!} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full space-y-8'
        >
          <Flex gap={10}>
            {/* Member's Avatar */}
            <Avatar
              w={200}
              h={200}
              fontSize={100}
              src={user?.info.imageUrl || user?.image || ''}
              bg='yellow.500'
              icon={<User />}
              cursor='pointer'
            >
              <AvatarBadge
                boxSize='80px'
                bg='lightgrey'
                borderWidth={10}
                _hover={{
                  bg: 'grey'
                }}
                onClick={() => setOpen(true)}
              >
                <EditIcon boxSize={8} />
              </AvatarBadge>
            </Avatar>
            <SimpleGrid columns={3} gap={5}>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormDescription className='font-semibold text-black'>
                      First Name
                    </FormDescription>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='First Name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='middleName'
                render={({ field }) => (
                  <FormItem>
                    <FormDescription className='font-semibold text-black'>
                      Middle Name
                    </FormDescription>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='Middle Name'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormDescription className='font-semibold text-black'>
                      Last Name
                    </FormDescription>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='Last Name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='birthDay'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold text-black'>
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input type='date' disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold text-black'>
                      Contact Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder='09XX-XXX-XXXX'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='space-y-3 '>
                    <FormLabel className='font-semibold text-black'>
                      Resident Type
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex p-1 space-x-4 space-y-1'
                        disabled={user?.info?.type || isPending}
                      >
                        <FormItem className='flex items-center space-x-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='Homeowner' />
                          </FormControl>
                          <FormLabel className='font-normal'>
                            Homeowner
                          </FormLabel>
                        </FormItem>
                        <FormItem className='flex items-center space-x-2 space-y-0'>
                          <FormControl>
                            <RadioGroupItem value='Tenant' />
                          </FormControl>
                          <FormLabel className='font-normal'>Tenant</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='col-span-2'>
                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-semibold text-black col-span-2'>
                        Home Address
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={'Select your home address'}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map(property => {
                            return (
                              <SelectItem
                                key={property.id}
                                value={property.id || ''}
                              >
                                {property.address}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='relation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold text-black'>
                      Relation
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={user?.info?.relation || isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={'Select your home relation'}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={HomeRelation.PARENT}>
                          Parent
                        </SelectItem>
                        <SelectItem value={HomeRelation.CHILD}>
                          Child
                        </SelectItem>
                        <SelectItem value={HomeRelation.HELPER}>
                          Helper
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </SimpleGrid>
          </Flex>

          <div className='w-full '>
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold text-black'>
                    Biography
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Tell us a little bit about yourself...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending}
            colorScheme='yellow'
            size='sm'
            type='submit'
          >
            Save Changes
          </Button>
        </form>
      </Form>
    </Box>
  )
}
