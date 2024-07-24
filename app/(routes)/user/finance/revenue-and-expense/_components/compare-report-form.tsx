'use client'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'

import { ChevronDownIcon } from '@chakra-ui/icons'

interface CompareReportFormProps {
  onSuccess: () => void
}

export default function CompareReportForm ({
  onSuccess
}: CompareReportFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isButtonClicked, setIsButtonClicked] = useState(false)

  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [yearToCompare, setYearToCompare] = useState('')
  const [monthToCompare, setMonthToCompare] = useState('')

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  )

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const onSubmit = async () => {
    setIsButtonClicked(true)
    startTransition(() => {
      console.log(selectedYear, selectedMonth, yearToCompare, monthToCompare)
      router.push(
        `/user/finance/revenue-and-expense/compare?year=${selectedYear}&month=${selectedMonth}&compareYear=${yearToCompare}&compareMonth=${monthToCompare}`
      )
    })
  }
  return (
    <form>
      <div className='gap-y-4'>
        <div className='mb-5'>
          {/* Select Year */}
          <Flex gap={2} fontFamily='font.body'>
            <Text fontSize='sm' w='400px' fontWeight='semibold'>
              Select Year:
            </Text>
            <Box w='500px'>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size='sm'
                  variant='outline'
                  w='full'
                  textAlign='left'
                >
                  {selectedYear || 'Select year'}
                </MenuButton>
                <MenuList maxHeight='300px' overflowY='auto'>
                  {years.map(year => (
                    <MenuItem
                      key={year}
                      onClick={() => {
                        setSelectedYear(year.toString())
                      }}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          </Flex>

          {/* Select Month */}
          <Flex gap={2} fontFamily='font.body'>
            <Text fontSize='sm' w='400px' fontWeight='semibold'>
              Select Month:
            </Text>
            <Box w='500px'>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size='sm'
                  variant='outline'
                  w='full'
                  textAlign='left'
                >
                  {months[parseInt(selectedMonth)] || 'Select month'}
                </MenuButton>
                <MenuList maxHeight='300px' overflowY='auto'>
                  {months.map((month, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        setSelectedMonth(index.toString())
                      }}
                    >
                      {month}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        </div>
        <div>
          {/* Year to Compare */}
          <Flex gap={2} fontFamily='font.body'>
            <Text fontSize='sm' w='400px' fontWeight='semibold'>
              Year To Compare:
            </Text>
            <Box w='500px'>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size='sm'
                  variant='outline'
                  w='full'
                  textAlign='left'
                >
                  {yearToCompare || 'Select year'}
                </MenuButton>
                <MenuList maxHeight='300px' overflowY='auto'>
                  {years.map(year => (
                    <MenuItem
                      key={year}
                      onClick={() => {
                        setYearToCompare(year.toString())
                      }}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          </Flex>

          {/* Month to Compare */}
          <Flex gap={2} fontFamily='font.body'>
            <Text fontSize='sm' w='400px' fontWeight='semibold'>
              Month to Compare:
            </Text>
            <Box w='500px'>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size='sm'
                  variant='outline'
                  w='full'
                  textAlign='left'
                >
                  {months[parseInt(monthToCompare)] || 'Select month'}
                </MenuButton>
                <MenuList maxHeight='300px' overflowY='auto'>
                  {months.map((month, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        setMonthToCompare(index.toString())
                      }}
                    >
                      {month}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        </div>
      </div>

      {/* Submit Transaction Button */}
      <Box textAlign='right' mt='2rem'>
        <Button
          disabled={isPending}
          colorScheme='yellow'
          size='sm'
          isLoading={isButtonClicked}
          loadingText='Generating'
          onClick={() => onSubmit()}
        >
          Generate
        </Button>
      </Box>
    </form>
  )
}
