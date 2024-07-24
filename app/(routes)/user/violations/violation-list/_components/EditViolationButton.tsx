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
  FormHelperText,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { ViolationType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  ViolationTypeFormSchema,
  ViolationTypeFormValues
} from './AddViolationButton'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateViolationType } from '@/server/actions/violation-type'
import { Form, FormField } from '@/components/ui/form'
import { useState } from 'react'

interface EditViolationButtonProps {
  violation: ViolationType
}

const EditViolationButton: React.FC<EditViolationButtonProps> = ({
  violation
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const form = useForm<ViolationTypeFormValues>({
    resolver: zodResolver(ViolationTypeFormSchema),
    defaultValues: {
      title: violation.title,
      description: violation.description,
      firstOffenseFee: violation.firstOffenseFee.toString(),
      secondOffenseFee: violation.secondOffenseFee.toString(),
      thirdOffenseFee: violation.thirdOffenseFee.toString()
    }
  })

  const onSubmit = async (values: ViolationTypeFormValues) => {
    await updateViolationType(values, violation.id)
      .then(data => {
        if (data.success) {
          toast({
            title: `Violatoin Type Updated`,
            description: `Violation Type: ${values.title}`,
            status: 'info',
            position: 'bottom-right',
            isClosable: true
          })
        }
      })
      .then(() => {
        form.reset()
        router.refresh()
        setIsOpen(false)
      })
  }

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
              <DialogTitle>Edit a Violation </DialogTitle>
              <DialogDescription>
                You may edit the description of your selected violation.
              </DialogDescription>
            </DialogHeader>

            <Stack spacing='20px' my='1.5rem'>
              {/* Violation Title */}
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormControl isReadOnly>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Violation Title:
                    </FormLabel>
                    <Input
                      size='sm'
                      fontWeight='semibold'
                      type='string'
                      color='grey'
                      {...field}
                    />
                  </FormControl>
                )}
              />

              {/* Violation Description */}
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormControl>
                    <FormLabel fontSize='sm' fontWeight='semibold'>
                      Description:
                    </FormLabel>
                    <Textarea
                      fontFamily='font.body'
                      // placeholder='Write something...'
                      fontSize='sm'
                      {...field}
                      resize='none'
                    />
                  </FormControl>
                )}
              />

              {/* Violation Levels and Penalty Fees*/}
              <FormControl>
                <FormLabel fontSize='sm' fontWeight='semibold'>
                  Violation Levels and Penalty Fees
                </FormLabel>
                <TableContainer mx='1rem'>
                  <Table
                    size='xs'
                    variant='simple'
                    fontFamily='font.body'
                    cellPadding={5}
                  >
                    <Thead>
                      <Tr>
                        <Th fontSize='xs' fontFamily='font.body'>
                          Violation Level
                        </Th>
                        <Th
                          fontSize='xs'
                          fontFamily='font.body'
                          textAlign='center'
                        >
                          Penalty Fee
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody fontSize='sm' fontFamily='font.body'>
                      <FormField
                        control={form.control}
                        name='firstOffenseFee'
                        render={({ field }) => (
                          <Tr>
                            {/* Violation Level */}
                            <Td pl='0.5rem' lineHeight={1}>
                              <span className='font-semibold'>
                                First Offense:
                              </span>
                              <br />
                              <span className='text-[10px]'>
                                Initial violation of community rules or
                                regulations.
                              </span>
                            </Td>
                            {/* Penalty Fee */}
                            <Td textAlign='center'>
                              ₱{' '}
                              <Input
                                type='number'
                                textAlign='right'
                                w='8rem'
                                size='sm'
                                placeholder='XXX'
                                {...field}
                              />
                            </Td>
                          </Tr>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='secondOffenseFee'
                        render={({ field }) => (
                          <Tr>
                            {/* Violation Level */}
                            <Td pl='0.5rem' lineHeight={1}>
                              <span className='font-semibold'>
                                Second Offense:
                              </span>
                              <br />
                              <span className='text-[10px]'>
                                Repeated violation after a warning or previous
                                penalty.
                              </span>
                            </Td>
                            {/* Penalty Fee */}
                            <Td textAlign='center'>
                              ₱{' '}
                              <Input
                                type='number'
                                textAlign='right'
                                w='8rem'
                                size='sm'
                                placeholder='XXX'
                                {...field}
                              />
                            </Td>
                          </Tr>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='thirdOffenseFee'
                        render={({ field }) => (
                          <Tr>
                            {/* Violation Level */}
                            <Td pl='0.5rem' lineHeight={1}>
                              <span className='font-semibold'>
                                Third Offense:
                              </span>
                              <br />
                              <span className='text-[10px]'>
                                Persistent violation despite prior warnings or
                                penalties.
                              </span>
                            </Td>
                            {/* Penalty Fee */}
                            <Td textAlign='center'>
                              ₱{' '}
                              <Input
                                type='number'
                                textAlign='right'
                                w='8rem'
                                size='sm'
                                placeholder='XXX'
                                {...field}
                              />
                            </Td>
                          </Tr>
                        )}
                      />
                    </Tbody>
                  </Table>
                </TableContainer>
                <FormHelperText
                  fontFamily='font.body'
                  fontSize='xs'
                  textAlign='justify'
                >
                  Please enter the corresponding penalty fees for each level of
                  offense for this violation.
                </FormHelperText>
              </FormControl>
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
export default EditViolationButton
