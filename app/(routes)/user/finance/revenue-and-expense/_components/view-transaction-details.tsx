import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { TransactionColumn } from './columns'
import { Box, Flex, Stack, Text } from '@chakra-ui/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface ViewTransactionDetailsProps {
  data: TransactionColumn
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
                {/* Type */}
                <Badge
                  className={cn(
                    'w-[80px] md:text-xs p-1 text-center justify-center break-text',
                    data.type === 'REVENUE'
                      ? 'bg-green-700'
                      : data.type === 'EXPENSE'
                      ? 'bg-red-700'
                      : 'display-none'
                  )}
                >
                  {data.type}
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
                <Text>{data.dateIssued}</Text>
              </Box>
              {/* Date Recorded */}
              <Box>
                <Text fontWeight='semibold'>Date Recorded:</Text>
                <Text>{data.dateSubmitted}</Text>
              </Box>
            </Flex>

            {/* Recorded by */}
            <Flex gap={3}>
              <Text fontWeight='semibold'>Recorded by:</Text>
              <Text>{data.recordedBy}</Text>
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
