'use client'

import { useForm } from 'react-hook-form'
import { Modal } from '@/components/ui/modal'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { updatePosComm } from '@/server/actions/user-info'
import { HomeownerColumn } from './columns'
import { Button, Spinner, Text, useToast } from '@chakra-ui/react'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const PositionCommitteeSchema = z.object({
  position: z.string(),
  committee: z.string()
})

type PositionCommitteeFormValues = z.infer<typeof PositionCommitteeSchema>

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  data: HomeownerColumn
}

export const ChangePositionCommittee: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const positions = [
    { title: 'President' },
    { title: 'Secretary' },
    { title: 'Treasurer' },
    { title: 'Auditor' },
    { title: 'Member' }
  ]

  const committees = [
    { title: 'Board of Directors' },
    { title: 'Security Committee' },
    { title: 'Grievance & Adjudication Committee' },
    { title: 'Environment & Sanitation Committee' },
    { title: 'Election Committee' },
    { title: 'None' }
  ]

  const router = useRouter()
  const toast = useToast()
  const selectedMember = data.name

  const [isPending, startTransition] = useTransition()
  const { update } = useSession()

  const form = useForm<PositionCommitteeFormValues>({
    resolver: zodResolver(PositionCommitteeSchema),
    defaultValues: {
      position: data.position || '',
      committee: data.committee || ''
    }
  })

  const onSubmit = async (values: PositionCommitteeFormValues) => {
    const updateInfo = {
      ...values,
      committee: values.committee === 'None' ? null : values.committee
    }

    startTransition(() => {
      updatePosComm(data.id, updateInfo).then(data => {
        if (data.success) {
          console.log(data.success)
          update()
          toast({
            title: `Committee of Member Updated`,
            description: (
              <>
                <div>Member: {selectedMember}</div>
                <div>New Committee: {values.committee}</div>
              </>
            ),
            status: 'success',
            position: 'bottom-right',
            isClosable: true
          })

          router.refresh()
          onClose()
          router.refresh()
        }
      })
    })
  }

  return (
    <>
      <Modal
        title='Assign Member Position & Committee'
        description='Assign a selected member to a different position or committee.'
        isOpen={isOpen}
        onClose={onClose}
      >
        <>
          <Text fontSize='sm'>
            Member: <strong className='ml-3'>{data.name}</strong>
          </Text>
          <div className='flex w-full space-x-2'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full space-y-8'
              >
                <div className='grid py-4 gap-y-4'>
                  {/* Assign Position */}
                  <FormField
                    control={form.control}
                    name='position'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Position</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select position' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='overflow-y'>
                            {positions?.map((position, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={position.title}
                                  className='flex items-center justify-between '
                                >
                                  {position.title}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Assign Committee */}
                  <FormField
                    control={form.control}
                    name='committee'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Committee</FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select committee' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='overflow-y'>
                            {committees?.map((committee, index) => (
                              <SelectItem
                                key={index}
                                value={committee.title}
                                className='flex items-center justify-between'
                              >
                                {committee.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='flex items-center justify-end w-full space-x-2'>
                  {isPending ? (
                    <Spinner />
                  ) : (
                    <>
                      <Button
                        size='sm'
                        disabled={isPending}
                        variant='outline'
                        onClick={onClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        size='sm'
                        disabled={isPending}
                        variant='solid'
                        colorScheme='yellow'
                        type='submit'
                      >
                        Save Changes
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </>
      </Modal>
    </>
  )
}
