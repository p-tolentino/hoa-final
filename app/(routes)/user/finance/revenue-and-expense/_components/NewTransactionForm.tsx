'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  createTransaction,
  updateFunds
} from '@/server/actions/hoa-transaction'
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Button,
  useToast
} from '@chakra-ui/react'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NewTransactionSchema } from '@/server/schemas'
import { HoaTransaction } from '@prisma/client'

type TransactionFormValues = z.infer<typeof NewTransactionSchema>

interface NewTransactionFormProps {
  onSuccess: () => void
  currentFunds: number
  initialData?: HoaTransaction
}

export default function NewTransactionForm ({
  onSuccess,
  currentFunds,
  initialData
}: NewTransactionFormProps) {
  const router = useRouter()
  const { update } = useSession()
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  // Format String Number to have two decimal places
  function formatStringNumber (numberString: string) {
    const number = parseFloat(numberString)
    if (isNaN(number)) {
      return numberString
    }
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(NewTransactionSchema),
    defaultValues: {
      dateIssued: initialData?.dateIssued
        ? new Date(initialData?.dateIssued)?.toISOString().split('T')[0]
        : undefined,
      type: initialData?.type || undefined,
      purpose: initialData?.purpose || undefined,
      amount: initialData?.amount?.toString() || undefined,
      description: initialData?.description || undefined
    }
  })

  const onSubmit = async (values: TransactionFormValues) => {
    startTransition(() => {
      createTransaction(values)
        .then(data => {
          if (data.error) {
            console.log(data.error)
            return
          }

          if (data.success) {
            let newFund
            if (values.type === 'REVENUE') {
              newFund = currentFunds + parseInt(values.amount, 10)
            } else {
              newFund = currentFunds - parseInt(values.amount, 10)
            }
            updateFunds(newFund)
            update()
            onSuccess()
            form.reset()
            router.refresh()
            toast({
              title: 'Transaction Recorded',
              description: (
                <>
                  <div>Transaction Type: {values.type}</div>
                  <div>Amount: ₱ {formatStringNumber(values.amount)}</div>
                </>
              ),
              status: 'success',
              position: 'bottom-right',
              duration: 5000,
              isClosable: true
            })
            window.location.reload()
          }
        })
        .catch(error => {
          throw new Error(error)
        })
    })
  }

  return (
    <div className='h-[500px] overflow-y-auto px-2 pb-5'>
      <Box fontFamily='font.body'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='dateIssued'
              render={({ field }) => (
                <FormItem className='mb-5'>
                  <FormControl
                    isRequired
                    isInvalid={form.formState.errors.dateIssued ? true : false}
                  >
                    <FormLabel>Date issued:</FormLabel>
                    <Input
                      type='date'
                      max={new Date().toISOString().split('T')[0]}
                      {...field}
                    />
                    {form.formState.errors.dateIssued && (
                      <FormErrorMessage>
                        {form.formState.errors.dateIssued.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormControl isRequired mt='25px'>
                  <FormLabel>Transaction Type:</FormLabel>
                  <RadioGroup {...field} colorScheme='yellow'>
                    <Stack direction={'row'} spacing={5}>
                      <Radio value='REVENUE'>Revenue</Radio>
                      <Radio value='EXPENSE'>Expense</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name='purpose'
              render={({ field }) => (
                <FormControl isRequired mt='25px'>
                  <FormLabel>Purpose:</FormLabel>
                  <select
                    className='flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'
                    onChange={field.onChange}
                    value={field.value || ''}
                    disabled={isPending || !form.watch('type')}
                  >
                    {form.watch('type') === 'REVENUE' ? (
                      <>
                        <option value='' disabled>
                          Select purpose of revenue
                        </option>
                        <option value='Association Dues'>
                          Association Dues
                        </option>
                        <option value='Toll Fees'>Toll Fees</option>
                        <option value='Facility Rentals'>
                          Facility Rentals
                        </option>
                        <option value='Renovation and Demolition Fees'>
                          Renovation and Demolition Fees
                        </option>
                        <option value='Car Sticker Receipts'>
                          Car Sticker Receipts
                        </option>
                        <option value='Donations'>Donations</option>
                        <option value='Other Revenues'>Others</option>
                      </>
                    ) : form.watch('type') === 'EXPENSE' ? (
                      <>
                        <option value='' disabled>
                          Select purpose of expense
                        </option>
                        <option value='Salaries and Benefits'>
                          Salaries and Benefits
                        </option>
                        <option value='Utilities'>Utilities</option>
                        <option value='Office Supplies'>Office Supplies</option>
                        <option value='Repair and Maintenance'>
                          Repair and Maintenance
                        </option>
                        <option value='Donations'>Donations</option>
                        <option value='Furnitures and Fixtures'>
                          Furnitures and Fixtures
                        </option>
                        <option value='Representation Expenses'>
                          Representation Expenses
                        </option>
                        <option value='Legal & Professional Fees'>
                          Legal & Professional Fees
                        </option>
                        <option value='Administrative Costs'>
                          Administrative Costs
                        </option>
                        <option value='Miscellaneous'>Miscellaneous</option>
                      </>
                    ) : (
                      <option value=''>
                        Please specify transaction type first...
                      </option>
                    )}
                  </select>
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormControl isRequired mt='25px'>
                  <FormLabel>Amount (in Php):</FormLabel>
                  <Input
                    {...field}
                    type='number'
                    placeholder='Enter amount'
                    min={0} // Ensures that the browser enforces a minimum value of 0
                    onChange={e => {
                      // Prevents input of negative numbers
                      const value = parseFloat(e.target.value)
                      if (!isNaN(value) && value >= 0) {
                        field.onChange(value.toString()) // Ensures the value is a string if needed
                      } else if (e.target.value === '') {
                        // Allows clearing the field
                        field.onChange('')
                      }
                    }}
                    value={field.value}
                  />
                  {form.formState.errors.amount && (
                    <FormErrorMessage>
                      {form.formState.errors.amount.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormControl mt='25px'>
                  <FormLabel>Description:</FormLabel>
                  <Textarea
                    {...field}
                    placeholder='Enter description here'
                    maxLength={100}
                    rows={3}
                    resize={'none'}
                  />

                  <FormHelperText>
                    Maximum of 100 characters only.
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Box textAlign={'right'} mt='2rem'>
              <Button
                disabled={isPending}
                colorScheme='yellow'
                size='sm'
                type='submit'
                isLoading={isPending}
                loadingText='Submitting'
              >
                Submit Transaction
              </Button>
            </Box>
          </form>
        </Form>
      </Box>
    </div>
  )
}
