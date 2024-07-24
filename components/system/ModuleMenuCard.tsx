'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import Link from 'next/link'
import {
  Card,
  CardBody,
  Heading,
  Button,
  ButtonGroup,
  Text,
  Stack,
  CardHeader
} from '@chakra-ui/react'

// Category Button Props
interface CategoryButton {
  text: string
  href: string
  description: string
  officerRequired?: boolean
}

// Category Data Props
interface CategoryData {
  category: string
  category_users?: string
  category_buttons: CategoryButton[]
  officerRequired?: boolean
}

const ModuleMenuCard: React.FC<{ data: CategoryData }> = ({ data }) => {
  // Get current user
  const user = useCurrentUser()

  // Extract category, category_users, and category_buttons properties from the data object
  const { category, category_users, category_buttons } = data

  // Conditionally render buttons based on the user's role and position
  if (
    (user?.info.position !== 'Member' && data.officerRequired) ||
    user?.info.committee === category_users ||
    !data?.officerRequired
  ) {
    return (
      <Card
        w='360px'
        h='max-content'
        p='5px'
        shadow='lg'
        borderWidth='2px'
        borderColor='brand.400'
      >
        <CardHeader pb={category_users !== '' ? '0' : '1'}>
          {/* Category Name */}
          <Heading
            fontSize={{ sm: 'lg', lg: '19px' }}
            color={'brand.500'}
            fontFamily='font.heading'
          >
            {category}
          </Heading>
          {/* Category Users */}
          {category_users && (
            <Text fontSize='sm' fontFamily='font.body' textAlign='justify'>
              For the exclusive use of the{' '}
              <span className='font-semibold'>{category_users}</span>
            </Text>
          )}
        </CardHeader>
        <CardBody>
          <ButtonGroup
            flexDir={'column'}
            gap={'0.5rem'}
            minW={'100%'}
            fontFamily='font.body'
          >
            <Stack spacing={6} pb='1rem'>
              {/* Category Buttons */}
              {category_buttons.map(cButton =>
                (cButton.officerRequired && user?.info.position !== 'Member') ||
                !cButton.officerRequired ? (
                  <div key={cButton.text}>
                    {/* Category Button Props */}
                    <Button
                      w='full'
                      fontSize='15.5px'
                      fontWeight='400'
                      bgColor='brand.300'
                      _hover={{
                        bgColor: '#fcdf86',
                        transform: 'scale(1.02)',
                        fontWeight: 'semibold'
                      }}
                      mb={category_users !== '' ? '0' : '10px'}
                      as={Link}
                      href={cButton.href}
                    >
                      {cButton.text}
                    </Button>
                    {cButton.description !== '' && (
                      <Text mt='5px' fontSize='sm' textAlign='justify'>
                        {cButton.description}
                      </Text>
                    )}
                  </div>
                ) : null
              )}
            </Stack>
          </ButtonGroup>
        </CardBody>
      </Card>
    )
  } else {
    return null
  }
}

export default ModuleMenuCard
