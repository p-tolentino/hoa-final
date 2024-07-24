'use client'

import { Text, Heading, Stack, Center, Box, Flex } from '@chakra-ui/react'
import { About } from './_components/about'
import { Contact } from './_components/contact'
import { RegisterHOA } from './_components/register-hoa'
import PublicLayout from '../../layout'
import { Hoa } from '@prisma/client'

interface HomeProps {
  existingHoa: Hoa | null
}

export const Homepage: React.FC<HomeProps> = ({ existingHoa }) => {
  return (
    <PublicLayout>
      <Box id='about'>
        <Center
          mt='4.5%'
          h={{ sm: '40vh', md: '30vh' }}
          bgSize={'cover'}
          bgImage={`url("/landscapeLowerOpacity.png")`}
        >
          <Flex bgColor={'rgba(255, 255, 255, 0.6)'}>
            <Stack
              direction={'column'}
              alignItems={'center'}
              textAlign={'center'}
              p='2rem'
            >
              <Heading size={'xl'} fontFamily='font.heading'>
                HOAs.is
              </Heading>
              <Text
                fontFamily='font.body'
                fontSize='1.2rem'
                textAlign={'center'}
                textShadow='1px 1px grey.05'
              >
                A Management Information System (MIS) for Homeowners'
                Associations in the Philippines.
              </Text>
            </Stack>
          </Flex>
        </Center>
        <About />
        {!existingHoa && <RegisterHOA />}
        <Contact />
      </Box>
    </PublicLayout>
  )
}

export default Homepage
