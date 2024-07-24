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
  TableContainer,
  Table,
  Tr,
  Tbody,
  Td,
  Box,
  Flex
} from '@chakra-ui/react'

import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'
import { useState } from 'react'
import { ExternalMaintainers } from '@prisma/client'
import {
  ExternalContactFormSchema,
  ExternalContactFormValues
} from './AddContactButton'
import { updateContact } from '@/server/actions/external-contact'
import FileUploadField from './FileUploadField'

const EditContactButton = ({ contact }: { contact: ExternalMaintainers }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const toast = useToast()

  const form = useForm<ExternalContactFormValues>({
    resolver: zodResolver(ExternalContactFormSchema),
    defaultValues: {
      name: contact.name || '',
      service: contact.service || '',
      logoImg: contact.logoImg || ''
    }
  })

  const [contactNumbers, setContactNumbers] = useState<string[]>(
    contact.contactNumbers || ['']
  )

  const handleAddRow = () => {
    setContactNumbers([...contactNumbers, ''])
  }

  const handleRemoveRow = (index: number) => {
    const updatedContactNumbers = [...contactNumbers]
    updatedContactNumbers.splice(index, 1)
    setContactNumbers(updatedContactNumbers)
  }

  const onSubmit = async (values: ExternalContactFormValues) => {
    const data = {
      ...values,
      contactNumbers: contactNumbers
    }

    await updateContact(data, contact.id)
      .then(data => {
        if (data.success) {
          setIsOpen(false)
          toast({
            title: `External Contact Updated`,
            description: `Contact: ${form.watch('name')}`,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='xs' mr='5px'>
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className='h-[500px] overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit a Contact</DialogTitle>
              <DialogDescription>
                You may edit the following information of your selected contact.
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <Stack spacing='15px' my='2rem'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Organization Name:
                    </FormLabel>
                    <Input
                      size='md'
                      fontWeight='semibold'
                      type='string'
                      placeholder='Enter an Organization Name'
                      // disabled
                      {...field}
                    />
                  </FormControl>
                )}
              />

              <Box py='10px'>
                <Stack spacing='15px'>
                  {/* Service */}
                  <FormField
                    control={form.control}
                    name='service'
                    render={({ field }) => (
                      <FormControl isRequired>
                        <FormLabel fontSize='sm' fontWeight='semibold'>
                          Services:
                        </FormLabel>
                        <Textarea
                          placeholder='Write something...'
                          id='externalServices'
                          fontSize='xs'
                          resize='none'
                          {...field}
                        />
                      </FormControl>
                    )}
                  />
                </Stack>
              </Box>

              <Box py='10px'>
                <Stack spacing='15px'>
                  {/* Service */}
                  <FormControl isRequired>
                    <Flex justifyContent='space-between'>
                      <FormLabel fontSize='sm' fontWeight='semibold'>
                        Contact Number/s:
                      </FormLabel>
                      <Button
                        size='xs'
                        onClick={handleAddRow}
                        leftIcon={<AddIcon />}
                      >
                        Add
                      </Button>
                    </Flex>
                    <TableContainer overflowY='auto'>
                      <Table size='xs' variant='simple' fontFamily='font.body'>
                        <Tbody fontSize='sm' fontFamily='font.body'>
                          {contactNumbers.map((num, index) => (
                            <Tr key={index}>
                              {/* Activity Input */}
                              <Td>
                                <FormControl isRequired>
                                  <Input
                                    type='number'
                                    size='sm'
                                    fontSize='sm'
                                    w='80%'
                                    mr={3}
                                    defaultValue={num}
                                    onChange={e => {
                                      const updatedContactNumbers = [
                                        ...contactNumbers
                                      ]
                                      updatedContactNumbers[index] =
                                        e.target.value
                                      setContactNumbers(updatedContactNumbers)
                                    }}
                                  />
                                  {index > 0 && (
                                    <Button
                                      size='xs'
                                      colorScheme='red'
                                      onClick={() => handleRemoveRow(index)}
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  )}
                                </FormControl>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </FormControl>
                </Stack>
              </Box>

              {/* Upload Media */}

              {/* Option 1 */}
              <FileUploadField />

              {/* Option 2 */}
              {/* <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Upload Logo
                </FormLabel>
                <Input type="file" fontSize="xs" />
              </FormControl> */}
            </Stack>

            <DialogFooter className='text-right'>
              <FormControl>
                {/* Save Changes Button */}
                <Button size='sm' colorScheme='yellow' type='submit'>
                  Save Changes
                </Button>
              </FormControl>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default EditContactButton
