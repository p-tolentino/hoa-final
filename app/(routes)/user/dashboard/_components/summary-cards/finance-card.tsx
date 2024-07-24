'use client'

import { Box, Text, Flex, Avatar, Spinner } from '@chakra-ui/react'
import { TbCurrencyPeso } from 'react-icons/tb'

interface dashboardPoll {
  count: number
}

export default function FinanceCard ({ count }: dashboardPoll) {
  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === 'string' ? parseFloat(amount) : amount

    // Define thresholds for millions and billions
    const million = 1000000
    const billion = 1000000000

    let formattedAmount: string

    if (numericAmount >= billion) {
      formattedAmount = (numericAmount / billion).toFixed(1) + 'B'
    } else if (numericAmount >= million) {
      formattedAmount = (numericAmount / million).toFixed(1) + 'M'
    } else {
      formattedAmount = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(numericAmount)
    }

    return formattedAmount
  }

  return (
    <Box>
      <Flex
        alignItems='flex-start'
        direction='row'
        justifyContent='space-between'
        p={4}
        borderRadius='md'
        boxShadow='md'
        bg='white'
        h='100px'
        minW='200px'
      >
        <Box>
          <Text color='gray.500' textTransform='uppercase' fontSize='xs'>
            Total Funds
          </Text>
          {count ? (
            <Text fontSize='2xl' fontWeight='bold'>
              {formatCurrency(count)}
            </Text>
          ) : (
            <Spinner mt={2} />
          )}
        </Box>
        <Avatar
          bg='#7CA689'
          size='md'
          icon={<TbCurrencyPeso size={26} color='white' />}
        />
      </Flex>
    </Box>
  )
}
