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
  Box,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Flex,
  useToast
} from '@chakra-ui/react'

import { Form, FormField } from '@/components/ui/form'

import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import FileUploadField from './FileUploadField' // Adjust the import path as needed
import { createContact } from '@/server/actions/external-contact'

export const ExternalContactFormSchema = z.object({
  name: z.string(),
  service: z.string(),
  logoImg: z.string()
})

export type ExternalContactFormValues = z.infer<
  typeof ExternalContactFormSchema
>

function AddNewContactButton () {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const toast = useToast()

  const form = useForm<ExternalContactFormValues>({
    resolver: zodResolver(ExternalContactFormSchema),
    defaultValues: {
      name: '',
      service: '',
      logoImg: ''
    }
  })

  const [contactNumbers, setContactNumbers] = useState([''])

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

    console.log(data)

    await createContact(data)
      .then(() => {
        form.reset() // Reset form upon success
        setIsOpen(false) // Close dialog upon success
        toast({
          title: `External Contact Added`,
          description: `Contact: ${form.watch('name')}`,
          status: 'success',
          position: 'bottom-right',
          isClosable: true
        })
        router.refresh() // Refresh the page or navigate as needed
      })
      .catch(error => {
        console.error('Failed to add new contact:', error)
      })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' colorScheme='yellow'>
          <AddIcon boxSize={3} mr='10px' />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className='h-[500px] overflow-y-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Contact</DialogTitle>
              <DialogDescription>
                Fill up the following fields to add a new contact.
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
                          {contactNumbers.map((contactNum, index) => (
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
            <DialogFooter>
              <Button size='sm' colorScheme='yellow' type='submit'>
                Add New Contact
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default AddNewContactButton
