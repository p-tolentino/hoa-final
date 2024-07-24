import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { TransactionRecordColumn } from './columns'
import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { format } from 'date-fns'

interface ViewTransactionDetailsProps {
  data: TransactionRecordColumn
  onClose: () => void // Function to close the dialog
}

// Format Currency, whether it be a type number or string
const formatCurrency = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(numericAmount)
}

export const ViewTransactionDetails: React.FC<ViewTransactionDetailsProps> = ({
  data,
  onClose
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Transaction ID: {data.id}</DialogDescription>
          </DialogHeader>

          <Stack spacing={5} fontFamily='font.body' mb={5}>
            <Stack spacing={2}>
              <Flex align='center' gap={3}>
                {/* Status */}
                <Badge
                  className={cn(
                    'w-[100px] md:text-xs p-1 text-center justify-center break-text',
                    {
                      'bg-green-700': data.status === 'PAID',
                      'bg-red-700': data.status === 'OVERDUE',
                      'bg-yellow-600':
                        data.status === 'UNPAID' || data.status === 'UNSETTLED',
                      hidden: !['PAID', 'OVERDUE', 'UNPAID'].includes(
                        data.status
                      )
                    }
                  )}
                >
                  {data.status}
                </Badge>

                {/* Amount */}
                <Text fontWeight='bold' fontSize='lg' textAlign='right'>
                  {formatCurrency(data.amount)}
                </Text>
              </Flex>
            </Stack>
            <Flex gap={10}>
              {/* Date Issued */}
              <Box>
                <Text fontWeight='semibold'>Date Issued:</Text>
                <Text>{format(data.dateIssued, 'dd MMM yyyy')}</Text>
              </Box>
              {/* Date Paid */}
              <Box>
                <Text fontWeight='semibold'>Date Paid:</Text>
                {data.datePaid ? (
                  <Text>{format(data.datePaid, 'dd MMM yyyy')}</Text>
                ) : (
                  <Text color='gray.300' as='i'>
                    N/A
                  </Text>
                )}
              </Box>
            </Flex>

            {/* Paid by */}
            <Flex gap={3}>
              <Text fontWeight='semibold'>Paid by:</Text>
              {data.paidBy ? (
                <Text>{data.paidBy}</Text>
              ) : (
                <Text color='gray.300' as='i'>
                  N/A
                </Text>
              )}
            </Flex>
            {/* Description */}
            <Box>
              <Text fontWeight='semibold'>Description:</Text>
              <Text>{data.description}</Text>
            </Box>
          </Stack>
        </DialogContent>
      </DialogTrigger>
    </Dialog>
  )
}
