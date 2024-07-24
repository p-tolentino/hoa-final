'use client'

import {
  Box,
  Heading,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr
} from '@chakra-ui/react'

export default function MembershipInformation ({
  biography,
  contactNumber
}: {
  biography: string
  contactNumber: string
}) {
  return (
    <SimpleGrid
      columns={2}
      mt='3rem'
      spacing={{ md: '2.5rem', lg: '5rem' }}
      minChildWidth={{ md: '35vw', lg: '20vw' }}
    >
      {/* Biography */}
      <Box>
        <Heading size='md' fontFamily={'font.heading'} mb={'1rem'}>
          Biography
        </Heading>
        <Text fontFamily={'font.body'}>{biography}</Text>
      </Box>
      {/* Personal Information */}
      <Box mb={{ md: '3rem', lg: '0' }}>
        <Heading size='md' fontFamily={'font.heading'} mb={'1rem'}>
          Personal Information
        </Heading>
        <TableContainer>
          <Table w='35vw'>
            <Tbody>
              <Tr>
                <Td px={0} py={2} style={{ fontWeight: 'bold' }}>
                  House No. & Street
                </Td>
                <Td px={0} py={2}>
                  00 Apple Street
                </Td>
              </Tr>
              <Tr>
                <Td px={0} py={2} style={{ fontWeight: 'bold' }}>
                  Contact Number
                </Td>
                <Td px={0} py={2}>
                  {contactNumber}
                </Td>
              </Tr>
              <Tr>
                <Td px={0} py={2} style={{ fontWeight: 'bold' }}>
                  Email Address
                </Td>
                <Td px={0} py={2}>
                  john.doe@gmail.com
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </SimpleGrid>
  )
}
