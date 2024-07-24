'use client'
import { Box, Link, Text } from '@chakra-ui/react'

export default function PayPenaltyFee () {
  return (
    <div>
      <Box mb='1rem'>
        {/* Section Title */}
        <Text fontSize='xl' fontFamily='font.heading' fontWeight='bold'>
          Pay Penalty Fee
        </Text>
      </Box>
      <Text textAlign='justify' fontFamily='font.body' fontSize='sm'>
        To pay the penalty fee associated with the violation, the violator(s)
        should navigate to the Finance Management module within the MIS. In this
        module, they can access their{' '}
        <Link
          href='/user/finance/statement-of-account'
          color='blue.500'
          textDecor='underline'
        >
          Statement of Account
        </Link>
        , which provides a detailed overview of their financial transactions
        with the HOA. Once the violator(s) locates the penalty fee within their
        statement of account, they can proceed to make the payment using the
        available payment options. This straightforward process ensures that the
        penalty fee is settled efficiently, contributing to the resolution of
        the violation and maintaining compliance with HOA regulations.
      </Text>
    </div>
  )
}
