'use client'

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
  FormHelperText
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { MaintenanceType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  MaintenanceTypeFormSchema,
  MaintenanceTypeFormValues
} from './AddMaintenanceButton'
import { zodResolver } from '@hookform/resolvers/zod'
// import { getMaintenanceTypeByName } from '@/server/data/maintenance-type'
import { updateMaintenanceType } from '@/server/actions/maintenance-type'
import { Form, FormField } from '@/components/ui/form'
import { useState } from 'react'

interface EditMaintenanceButtonProps {
  maintenance: MaintenanceType
}

const EditMaintenanceButton: React.FC<EditMaintenanceButtonProps> = ({
  maintenance
}) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<MaintenanceTypeFormValues>({
    resolver: zodResolver(MaintenanceTypeFormSchema),
    defaultValues: {
      title: maintenance.title,
      description: maintenance.description
    }
  })

  const onSubmit = async (values: MaintenanceTypeFormValues) => {
    await updateMaintenanceType(values, maintenance.id)
      .then(data => {
        if (data.success) {
          setIsOpen(false)
          toast({
            title: `Maintenance Service Type Updated`,
            description: `Maintenance Service Type: ${form.watch('title')}`,
            status: 'success',
            position: 'bottom-right',
            isClosable: true
          })
        }
      })
      .then(() => {
        form.reset()
        router.refresh()
      })
  }
  const toast = useToast()
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='xs' mr='5px'>
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit a Maintenance Service Type</DialogTitle>
              <DialogDescription>
                You may edit the description of your selected maintenance
                service type.
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <Stack spacing='15px' my='2rem'>
              {/* Maintenance Title */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormControl isReadOnly>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Maintenance Title:
                    </FormLabel>
                    <Input
                      size='md'
                      fontWeight='semibold'
                      type='string'
                      placeholder='Enter a Title'
                      color='grey'
                      {...field}
                    />
                  </FormControl>
                )}
              />

              {/* Maintenance Description */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Description:
                    </FormLabel>
                    <Textarea
                      fontFamily='font.body'
                      placeholder='Write something...'
                      fontSize='sm'
                      resize='none'
                      {...field}
                    />
                  </FormControl>
                )}
              />
            </Stack>

            <DialogFooter>
              <Button size='sm' colorScheme='yellow' type='submit'>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default EditMaintenanceButton
